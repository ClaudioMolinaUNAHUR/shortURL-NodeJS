const formidable = require("formidable"); // manejador de imagenes
const Jimp = require('jimp');
const path = require('path'); // permite unir rutas 
const fs = require('fs'); // filesistems
const User = require("../models/User");

module.exports.formPerfil = async(req, res) => { 
    try {
        const user = await User.findById(req.user.id);
        return res.render("perfil", {user: req.user, imagen: user.imagen});        
    } catch (error) {
        req.flash("mensajes", [{msg: "Error al leer el usuario"}]);
        return res.redirect("/perfil")
    }
};

module.exports.editarFotoPerfil = async(req, res) => {
    const form = new formidable.IncomingForm()
    form.maxFileSize = 5 * 1024 * 1024 //5Mb

    form.parse(req, async(err, fields, files) => {

        try {
            if(err) throw new Error("fallo al subir imagen")

            const file = files.myfile
            const imageTypes = ['image/jpeg', 'image/png']
            
            //validaciones
            if(file.originalFilename === "") throw new Error("por favor agrega una imagen");

            if( !imageTypes.includes(file.mimetype) ) throw new Error("por favor agrege una imagen jpg o png"); 
            // if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") // otra forma de validar

            if(file.size > 5 * 1024 * 1024) throw new Error("por favor imagen menor a 5Mb");
            //fin validaciones

            const extension = file.mimetype.split("/")[1];
            const dirFile = path.join(__dirname, `../public/img/perfiles/${req.user.id}.${extension}`);

            fs.renameSync(file.filepath, dirFile); // cambia la ruta actual por la nueva

            const image = await Jimp.read(dirFile); // lee un archivo y le proporciona metodos
            image.resize(200, 200).quality(90).writeAsync(dirFile); // redimensionamos la imagen y la guardamos

            const user = await User.findById(req.user.id);
            user.image = `${req.user.id}.${extension}`;
            await user.save();

            req.flash("mensajes", [{msg: "imagen actualizada"}]);

        } catch (error) {
            console.log(error);
            req.flash("mensajes", [{msg: error.message}]);

        } finally {
            return res.redirect("/perfil")
        }
    })


}