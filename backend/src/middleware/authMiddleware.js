function isNotLoggedIn(req, res, next){
    if(!req.session.userId){
        return next();
    }
    res.redirect('/index');
    //return res.status(400).json({message:'Utente già loggato'});
}

function isLoggedIn(req,res,next){
    if(req.session && req.session.userId){
        return next();
    }
    return res.redirect('/');
}

module.exports = {
    isNotLoggedIn,
    isLoggedIn
};