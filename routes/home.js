const express = require('express');
const {leerUrls ,agregarUrl, eliminarUrl, findParaEditar, editarUrl, redireccionamiento} = require('../controllers/homeControllers');
const validarUrl = require('../middleware/urlValida');
const verificarUser = require('../middleware/verificarUser');

const router = express.Router();

router.get('/',verificarUser ,leerUrls);
router.post('/',verificarUser , validarUrl, agregarUrl);
router.get('/eliminar/:id',verificarUser , eliminarUrl);
router.get('/editar/:id',verificarUser , findParaEditar );
router.post('/editar/:id',verificarUser , validarUrl, editarUrl )
router.get('/:shortUrl', redireccionamiento );

module.exports = router;