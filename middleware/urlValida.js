const validarUrl = async(req, res, next) =>{
    try {
        const { origin } = req.body;
        urlFrontend  = new URL(origin); // clase que en sus atributos devuelve true o null,
        if(urlFrontend.origin != 'null'){
            if (urlFrontend.protocol === 'http:' || urlFrontend.protocol === 'https:' ) {
                return next();
            }
            throw new Error('tiene que tener https://')
        } else{
            throw new Error('no valida 😫')
        }        
    } catch (error) {
        // console.log(error)
        // return res.send("url no valida")
        if(error.message === 'invalid URL'){ //si el error es capturado por URL(origin), le cambio el nombre con esto
            error.message = 'URL invalida'
        }
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
}

module.exports = validarUrl;