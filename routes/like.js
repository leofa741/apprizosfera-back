const { Router} = require('express');
const { check } = require('express-validator');
const { validarcampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jws');

const { getLikes,createLike ,deleteLike } = require('../controllers/like');


const router = Router();

router.get('/', getLikes);

router.post('/', [
    validarJWT ,
    validarcampos   
], createLike );

router.delete('/:id', [
    validarJWT,
    check('id', 'El id del like es obligatorio').not().isEmpty(),
    validarcampos
], deleteLike );




module.exports = router;


