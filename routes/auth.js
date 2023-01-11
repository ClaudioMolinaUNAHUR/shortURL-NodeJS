const express = require('express');
const { body } = require('express-validator');
const { loginForm, registerForm, registerUser, confirmarCuenta, loginUser, cerrarSesion } = require('../controllers/authControllers');

const router = express.Router()

router.get('/register', registerForm);
router.post(
    '/register',
    [
        body("userName", "Ingrese un nombre válido").trim().notEmpty().escape(), // limpiar lo que escribio el usuario, no esta vacio y solo interpreta texto(si manda script, lo lee como string)
        body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
        body("password", "Ingrese un contraseña de minimo 6 caracteres")
            .trim()
            .isLength({min: 6}) //largo minimo 6 caract
            .escape()
            .custom((value, {req}) => { //compara password contra repassword que viene del body de la Form
                if(value !== req.body.repassword){
                    throw new Error('no coinciden las contraseñas');
                }else{
                    return value;
                }
            }),
    ], 
    registerUser
);
router.get('/confirmar/:token', confirmarCuenta)
router.get('/login', loginForm);
router.post(
    '/login',
    [
        body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
        body("password", "Ingrese un contraseña de minimo 6 caracteres")
            .trim()
            .isLength({min: 6}) //largo minimo 6 caract
            .escape()
    ],
    loginUser);
router.get('/logout', cerrarSesion)

module.exports = router