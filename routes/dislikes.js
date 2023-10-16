const { Router} = require('express');
const { check } = require('express-validator');
const { validarcampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jws');

const { getDislikes,createDislike ,deleteDislike } = require('../controllers/dislikes');


const router = Router();

router.get('/', getDislikes);

router.post('/', [
    validarJWT,
    check('article', 'El id del articulo es obligatorio').not().isEmpty(),
    validarcampos
], createDislike );

router.delete('/:id', [
    validarJWT,
    check('id', 'El id del like es obligatorio').not().isEmpty(),
    validarcampos
], deleteDislike );


module.exports = router;

