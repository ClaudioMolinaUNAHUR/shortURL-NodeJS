const User = require("../models/User");
const { nanoid } = require('nanoid');


const loginForm =  (req, res) => { // primero creamos un GET para renderizar la primera vez
    res.render('login');
};

const loginUser = async(req, res) =>{ // con esto hacemos POST
    const {email, password} = req.body // esto viene del FORM
    try {
        const user = await User.findOne({email}) // funciones de mongoose
        if(!user) throw new Error('no existe este email');
        if(!user.cuentaConfirm) throw new Error('la cuenta no esta confirmada');
        if(!await user.comparePassword(password)) throw new Error('Contranseña inválida');

        res.redirect('/')

    } catch (error) {
        res.send(error.message);
    }
}

const registerForm =  (req, res) => { // primero creamos un GET para renderizar la primera vez
    res.render('register');
};

const registerUser =  async(req, res) => { // con esto hacemos POST
    const {userName, email, password} = req.body; // esto viene del FORM
    try {
        let user = await User.findOne({email}) // comprueba si ese usuario existe
        if(user) throw new Error('ya existe el usuario');

        user = new User({userName, email, password, tokenConfirm: nanoid() }); // creo un nuevo usuario si ya paso la validacion, podria pasar directamente REQ.BODY
        await user.save(); // Previamente se hasheo la pass, usando User.pre
        res.redirect('login')
    } catch (error) {
        res.json({error: error.message});
    };
};

const confirmarCuenta = async(req, res) => {
    const { token } = req.params
    try {
        const user = await User.findOne({tokenConfirm: token})
        if(!user) throw new Error('no existe el usuario')

        user.cuentaConfirm = true
        user.tokenConfirm = null

        res.redirect('/auth/login')
    } catch (error) {
        res.json({error: error.message});
    }
}

module.exports = {
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser
};