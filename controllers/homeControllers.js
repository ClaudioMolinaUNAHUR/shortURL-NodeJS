const Url = require('../models/Urls');
const { nanoid } = require('nanoid');//nanoid se actualizo, y solo funciona con ES module, para usar require usar npm install nanoid@3, es la version 3

const leerUrls = async (req, res) =>{
    try {
        const urls = await Url.find( {user: req.user.id} ).lean() //lean, dice q trae un objeto de js, no de mongoose
        res.render('home', {urls: urls}) // renderizo home desde la carpeta views
    } catch (error) {
        // console.log(error)
        // res.send('error algo fallo')        
        req.flash("mensajes", [{msg: error.message}]); 
        return res.redirect('/')
    }
}

const agregarUrl = async (req, res) =>{
    const { origin } = req.body;
    try{        
        const url = new Url({ origin, shortURL: nanoid(6), user: req.user.id}) //agrega req.user.id gracias a passport
        await url.save()
        req.flash("mensajes", [{msg: "Url Agregada"}]); 
        res.redirect('/');
    }catch(error){       
        req.flash("mensajes", [{msg: error.message}]); 
        return res.redirect('/');
    }
};

const eliminarUrl = async(req, res) =>{
    const {id} = req.params
    try {
        // await Url.findByIdAndDelete(id);
        
        const url = await Url.findById(id)
        if(!url.user.equals(req.user.id)){/* comparar el id del modelo de Url, contra el id, del modelo de user*/
            throw new Error('No es tu url payaso')
        }
        await url.remove();
        req.flash("mensajes", [{msg: "Url eliminada"}]); 
        res.redirect('/'); //vuelve al home, una vez actualizada
    } catch (error) {       
        req.flash("mensajes", [{msg: error.message}]); 
        return res.redirect('/');
    }
}

const findParaEditar = async(req, res) => {
    const {id} = req.params
    try {
        const url = await Url.findById(id).lean();

        if(!url.user.equals(req.user.id)){/* comparar el id del modelo de Url, contra el id, del modelo de user*/
            throw new Error('No es tu url payaso')
        }

        res.render('home', {url})

    } catch (error) {       
        req.flash("mensajes", [{msg: error.message}]); 
        return res.redirect('/')
    }
}

const editarUrl = async(req, res) => {
    const { id } = req.params;
    const { origin } = req.body;
    try {

        const url = await Url.findById(id)
        if(!url.user.equals(req.user.id)){/* comparar el id del modelo de Url, contra el id, del modelo de user*/
            throw new Error('No es tu url payaso')
        }

        await url.updateOne({origin})
        req.flash("mensajes", [{msg: "Url editada"}]);
        //await Url.findByIdAndUpdate(id, {origin});
        res.redirect('/')

    } catch (error) {       
        req.flash("mensajes", [{msg: error.message}]); 
        return res.redirect('/')
    }
}

const redireccionamiento = async(req, res) => {
    const {shortUrl} = req.params // el parametro de este get lo declare con Url en mayus y minus, por eso q al hacer la consulta
    try {
        const urlDB = await Url.findOne({ shortURL: shortUrl }) // debo decirle q la columna shortURL: va a buscar el valor de shortUrl
        //solucion seria, q parametros tmb le ponga de forma identica, pero lo hice asi para q se note
        if (!urlDB?.origin) {
            return req.flash("mensajes", [{msg: "este Short no esta en tu DB"}]); 
        }
        res.redirect(urlDB.origin)        
    } catch (error) {       
        req.flash("mensajes", [{msg: "no existe esta url configurada"}]); 
        return res.redirect('/auth/login')
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