const express = require('express');
const {leerUrls ,agregarUrl, eliminarUrl, findParaEditar, editarUrl, redireccionamiento} = require('../controllers/homeControllers');
const validarUrl = require('../middleware/urlValida');
const verificarUser = require('../middleware/verificarUser');

const router = express.Router();

router.get('/',verificarUser ,leerUrls);
router.post('/', validarUrl, agregarUrl);
router.get('/eliminar/:id', eliminarUrl);
router.get('/editar/:id', findParaEditar );
router.post('/editar/:id', validarUrl, editarUrl )
router.get('/:shortUrl', redireccionamiento );

module.exports = router;