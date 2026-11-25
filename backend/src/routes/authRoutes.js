const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isNotLoggedIn, isLoggedIn } = require('../middleware/authMiddleware');

//Login GET route
router.get('/', isNotLoggedIn, (req, res) => {
    res.render('signin', {layout: 'auth', title: 'Sign In', styles: ["auth.css"], scripts: ["login.js"]});
});
router.get('/index', isLoggedIn, (req, res) => {
    res.render('index', {layout: 'main', title: 'Home', styles: ["home.css","navbar.css"], scripts: ["index.js"]});
});
//Login POST route 
router.post('/login', authController.login);

//Registration GET route
router.get('/signup', (req, res) => {
    res.render('signup', {layout: 'auth', title: 'Sign Up', styles: ["auth.css"], scripts: []});
});

//Registration POST route
router.post('/auth', authController.registration);

//Logout GET route 
router.get('/logout', authController.logout);

module.exports = router;