const validarUrl = async(req, res, next) =>{
    try {
        const { origin } = req.body;
        urlFrontend  = new URL(origin); // clase que en sus atributos devuelve true o null,
        console.log(urlFrontend.origin) 
        if(urlFrontend.origin != 'null'){
            if (urlFrontend.protocol === 'http:' || urlFrontend.protocol === 'https:' ) {
                return next();
            }
        } else{
            throw new Error('no valida 😫')
        }        
    } catch (error) {
        console.log(error)
        return res.send("url no valida")
    }
}

module.exports = validarUrl;