const User = require("../models/User");
const { nanoid } = require('nanoid');
const { validationResult } = require('express-validator')


const loginForm =  (req, res) => { // primero creamos un GET para renderizar la primera vez
    res.render('login', { mensajes: req.flash("mensajes") }); //envio al front los mensajes de errores
};

const loginUser = async(req, res) =>{ // con esto hacemos POST

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash("mensajes", errors.array()); // creo session de flash con un arreglo de errores, si por algun motivo, pasa esta validacion
        // debe cargar si falla las validacion en DB una nueva session de flash
        return res.redirect('/auth/login')
    }

    const {email, password} = req.body // esto viene del FORM
    try {
        const user = await User.findOne({email}) // funciones de mongoose
        if(!user) throw new Error('no existe este email');
        if(!user.cuentaConfirm) throw new Error('la cuenta no esta confirmada');
        if(!await user.comparePassword(password)) throw new Error('Contranseña inválida');

        // creando la sesion de usuario a traves de passport
        req.login(user, function(err){
            if(err) throw new Error('error con passport, al crear sesion')
            res.redirect('/')
        });
        

    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]); // cargando nueva sesion de flash si falla en la DB
        return res.redirect('/auth/login')
        // res.send(error.message);
    }
}

const registerForm =  (req, res) => { // primero creamos un GET para renderizar la primera vez
    res.render('register', { mensajes: req.flash("mensajes") });
};

const registerUser =  async(req, res) => { // con esto hacemos POST

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash("mensajes", errors.array()); // creo session de flash con un arreglo de errores, si por algun motivo, pasa esta validacion
        // debe cargar si falla las validacion en DB una nueva session de flash
        return res.redirect('/auth/register')
    }

    const {userName, email, password} = req.body; // esto viene del FORM
    try {
        let user = await User.findOne({email}) // comprueba si ese usuario existe
        if(user) throw new Error('ya existe el usuario');

        user = new User({userName, email, password, tokenConfirm: nanoid() }); // creo un nuevo usuario si ya paso la validacion, podria pasar directamente REQ.BODY
        await user.save(); // Previamente se hasheo la pass, usando User.pre
        req.flash("mensajes", [{msg: "Revisa tu correo y valida la cuenta"}]) // guarda un mensaje en flash
        res.redirect('/auth/login')
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]); // cargando nueva sesion de flash si falla en la DB
        return res.redirect('/auth/register')
        //res.json({error: error.message});
    };
};

const confirmarCuenta = async(req, res) => {
    const { token } = req.params
    try {
        const user = await User.findOne({tokenConfirm: token})
        if(!user) throw new Error('no existe el usuario')

        user.cuentaConfirm = true
        user.tokenConfirm = null

        await user.save()
        req.flash("mensajes", [{msg: "Cuenta confirmada, puedes iniciar sesion"}])
        res.redirect('/auth/login')
    } catch (error) {        
        req.flash("mensajes", [{msg: "cuenta no confirmada"}]); // cargando nueva sesion de flash si falla en la DB
        return res.redirect('/auth/login')
        //res.json({error: error.message});
    }
}

const cerrarSesion = async(req, res) =>{
    req.logout(function(err) {
        if (err) { throw new Error('se produjo un error'); }
        res.redirect('/');
    });
}

module.exports = {
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
    cerrarSesion
};