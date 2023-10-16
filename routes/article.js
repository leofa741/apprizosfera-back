const { Router} = require('express');
const { check } = require('express-validator');
const { validarcampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jws');

const { getArticle,  getArticles, createArticle,  updateArticle,deleteArticle , getLatestArticles} = require('../controllers/article');


const router = Router();

router.get('/', getArticles); 
router.get('/article/:id', getArticle);
router.get('/latest/:last?', getLatestArticles);



router.post('/', [
    validarJWT,
    check('title', 'El nombre es obligatorio').not().isEmpty(),
    check('content', 'El contenido es obligatorio').not().isEmpty(),
    validarcampos
], createArticle );

router.put('/:id', [
    validarJWT,
    check('title', 'El nombre es obligatorio').not().isEmpty(),
    check('content', 'El contenido es obligatorio').not().isEmpty(),
    validarcampos
],updateArticle);

router.delete('/:id', validarJWT, deleteArticle );



module.exports = router;
