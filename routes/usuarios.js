const { Router} = require('express');
const { check } = require('express-validator');
const { validarcampos } = require('../middlewares/validar-campos');
const { getUsuarios,getUsuario, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jws');


const router = Router();



router.get('/',validarJWT ,getUsuarios);

router.get('/:id',validarJWT ,getUsuario);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarcampos,
], crearUsuario);


router.put('/:id',  
[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('rol', 'El role es obligatorio').not().isEmpty(),
   
    validarcampos,
   
], actualizarUsuario);

router.delete('/:id',validarJWT, borrarUsuario);




module.exports = router;
