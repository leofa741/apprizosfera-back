const { Router} = require('express');
const { check } = require('express-validator');
const { validarcampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jws');

const { getComments, createComment,deleteComment,updateComment } = require('../controllers/comments');


const router = Router();

router.get('/', getComments);

router.post('/', [
    validarJWT,
    check('content', 'El contenido es obligatorio').not().isEmpty(),
    validarcampos
], createComment );


router.delete('/:id', validarJWT, deleteComment );

router.put('/:id', [
    validarJWT,
    check('content', 'El contenido es obligatorio').not().isEmpty(),
    validarcampos
], updateComment );



module.exports = router;