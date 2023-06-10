const { Router} = require('express');
const { check } = require('express-validator');
const { validarcampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jws');

const { getProductos, crearProducto, actualizarProducto, borrarProducto , getProductosById} = require('../controllers/productos');



const router = Router();



// Obtener todas las productos - publico

router.get('/', getProductos);

// Obtener una producto por id - publico

// router.get('/:id', getCategoria);

// Crear producto - privado - cualquier persona con un token válido

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es incorrecta').isMongoId(),
    check('precio', 'El precio debe ser un número').isNumeric(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('linkdepago', 'El link de pago es obligatorio'),
    validarcampos
], crearProducto);


// Actualizar - privado - cualquier persona con un token válido

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoría es incorrecta').isMongoId(),
    check('precio', 'El precio debe ser un número').isNumeric(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
    check('linkdepago', 'El link de pago es obligatorio'),
    validarcampos
], actualizarProducto);


// Borrar una producto - Admin

router.delete('/:id', validarJWT, borrarProducto);

router.get('/:id', validarJWT,   getProductosById);


module.exports = router;
