module.exports = (req, res, next) =>{
    if(req.isAuthenticated()){ // verifica que la sesion este activa
        return next();
    }
    res.redirect('/auth/login');
};