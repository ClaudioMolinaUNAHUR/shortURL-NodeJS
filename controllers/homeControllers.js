const Url = require('../models/Urls');
const { nanoid } = require('nanoid');//nanoid se actualizo, y solo funciona con ES module, para usar require usar npm install nanoid@3, es la version 3

const leerUrls = async (req, res) =>{
    try {
        const urls = await Url.find().lean() //lean, dice q trae un objeto de js, no de mongoose
        res.render('home', {urls: urls}) // renderizo home desde la carpeta views
    } catch (error) {
        console.log(error)
        res.send('error algo fallo')
    }
}

const agregarUrl = async (req, res) =>{
    const { origin } = req.body;
    try{        
        const url = new Url({ origin, shortURL: nanoid(6)})
        await url.save()
        res.redirect('/')
    }catch(error){
        console.log(error)
        res.send('error algo fallo')
    }
};

const eliminarUrl = async(req, res) =>{
    const {id} = req.params
    try {
        await Url.findByIdAndDelete(id);

        res.redirect('/') //vuelve al home, una vez actualizada
    } catch (error) {
        console.log(error)
        res.send('se produjo un error')
    }
}

const findParaEditar = async(req, res) => {
    const {id} = req.params
    try {
        const url = await Url.findById(id).lean();
        res.render('home', {url})

    } catch (error) {
                console.log(error)
        res.send('se produjo un error')
    }
}

const editarUrl = async(req, res) => {
    const { id } = req.params;
    const { origin } = req.body;
    try {
        await Url.findByIdAndUpdate(id, {origin});
        res.redirect('/')

    } catch (error) {
                console.log(error)
        res.send('se produjo un error')
    }
}

const redireccionamiento = async(req, res) => {
    const {shortUrl} = req.params // el parametro de este get lo declare con Url en mayus y minus, por eso q al hacer la consulta
    try {
        const urlDB = await Url.findOne({ shortURL: shortUrl }) // debo decirle q la columna shortURL: va a buscar el valor de shortUrl
        //solucion seria, q parametros tmb le ponga de forma identica, pero lo hice asi para q se note
        if (!urlDB?.origin) {
            return res.send("error no existe el redireccionamiento");
        }
        res.redirect(urlDB.origin)        
    } catch (error) {
        res.send('error al redireccionar')
    };
;}

module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    findParaEditar,
    editarUrl,
    redireccionamiento
};