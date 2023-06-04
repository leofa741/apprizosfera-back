// ruta:  api/uploads/


const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jws');
const { uploadFile,mostrarImagen } = require('../controllers/uploads');

const expressFileUpload = require('express-fileupload');



const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, uploadFile);

router.get('/:tipo/:foto',  mostrarImagen);



module.exports = router;

// Compare this snippet from controllers\busquedas.js: