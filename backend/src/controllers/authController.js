const User = require('../models/userModel');
const argon2 = require('argon2');
const validator = require('../utils/validator');
const { emit } = require('../app');

async function login(req, res) {
    const emailInput = req.body.email || '';
    try {
        const email = validator.validateEmail(req.body.email);
        const password = validator.validatePassword(req.body.password);

        //check user exists
        const user = await User.findOne({where:{email}});
        if (!user) {
            return res.status(401).render('signin', {error: 'Credenziali non valide', email, layout: 'auth', title: 'Sign In', styles: ["auth.css"], scripts: ["login.js"]});
        }

        //check the user's password
        const isValidPassword = await argon2.verify(user.password_hash, password);
        if(!isValidPassword){
            return res.status(401).render('signin', {error: 'Credenziali non valide', email, layout: 'auth', title: 'Sign In', styles: ["auth.css"], scripts: ["login.js"]});
        }

        //login success
        req.session.userId = user.id;
        req.session.role = user.role;
        res.redirect('/index');
       /* return res.status(200).json({
            message: 'Login effettuato correttamente',
            user: {
                id: user.id,
                email: user.email
            }
        });*/
    } catch (error){
        if (error instanceof validator.ValidationError) {
            return res.status(400).render('signin', {error: error.message, email: emailInput, layout: 'auth', title: 'Sign In', styles: ["auth.css"], scripts: ["login.js"]});
        }

        console.error('Errore durante il login:', error);
        return res.status(500).render('signin', {error: 'Errore interno del server', email: emailInput, layout: 'auth', title: 'Sign In', styles: ["auth.css"], scripts: ["login.js"]});
    }
}

async function registration(req,res){
    const emailInput = req.body.email || '';
    try{
        const email = validator.validateEmail(req.body.email);

        const checkExists = await User.findOne({where:{email}});
        if(checkExists){
            return res.status(401).render('signup', {error: 'Utente esistente con questa email!', email, layout: 'auth', title: 'Sign Up', styles: ["auth.css"], scripts: ["login.js"]});
        }

        const password = validator.validatePassword(req.body.password);
        const passwordHash = await argon2.hash(password);

        const user = await User.create({
            email: email,
            password_hash: passwordHash
        });

        req.session.userId = user.id;
        req.session.role = 'STUDENT';

        return res.redirect('/index');
    }catch(error){
        if (error instanceof validator.ValidationError) {
            return res.status(400).render('signup', {error: error.message, email: emailInput, layout: 'auth', title: 'Sign Up', styles: ["auth.css"], scripts: ["login.js"]});
        }

        console.error('Errore durante la registrazione:', error);
        return res.status(500).render('signup', {error: 'Errore interno del server', email: emailInput, layout: 'auth', title: 'Sign Up', styles: ["auth.css"], scripts: ["login.js"]});
    }
}

async function logout (req,res){
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Errore logout');
        }
        res.redirect('/');
    });
}

module.exports = {
    login,
    registration,
    logout
}