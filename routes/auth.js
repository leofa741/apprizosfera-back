
const { Router } = require('express');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarcampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jws');

const router = Router();


router.post( '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        validarcampos
    ],
    login
)

router.post( '/google',
    [
        check('token', 'El id_token es obligatorio').not().isEmpty(),
        validarcampos
    ],
    googleSignIn
)





router.get( '/renew',
     validarJWT,
     renewToken
)





module.exports = router;

