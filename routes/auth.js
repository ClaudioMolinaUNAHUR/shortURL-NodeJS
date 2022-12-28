const express = require('express');
const { loginForm, registerForm, registerUser, confirmarCuenta, loginUser } = require('../controllers/authControllers');
const router = express.Router()

router.post('/register', registerUser);
router.get('/register', registerForm);
router.get('/confirmar/:token', confirmarCuenta)
router.get('/login', loginForm);
router.post('/login', loginUser);

module.exports = router