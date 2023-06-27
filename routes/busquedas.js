// ruta:  api/todo/:busqueda


const { Router } = require('express');

const { validarJWT } = require('../middlewares/validar-jws');

const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas');

const router = Router();

router.get('/:busqueda', getTodo);

router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion);

module.exports = router;

// Compare this snippet from controllers\busquedas.js: