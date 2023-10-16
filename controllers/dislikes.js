const { response } = require('express');
const Dislike = require('../models/dislike');
const Usuario = require('../models/usuario');
const Article = require('../models/article');
const Comment = require('../models/comments');

const getDislikes = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    
    await Promise.all([
        Dislike.countDocuments(),
        Dislike.find().populate('usuario', 'nombre email img')
                   .populate('article', 'title content date usuario comments likes dislikes')
                   .populate('comment', 'content date usuario article likes dislikes')
            .skip( desde )
            .limit( 10 )
    ])
    .then( respuestas => {

        res.json({
            ok: true,
            dislikes: respuestas[1],
            total: respuestas[0]
        });
    });
}


const createDislike = async(req, res = response) => {

    const dislike = new Dislike({
        usuario: req.uid,
        ...req.body
    });

    try {

        const dislikeDB = await dislike.save();
        const usuario = await Usuario.findById(dislike.usuario);
        const article = await Article.findById(dislike.article);
        const comment = await Comment.findById(dislike.comment);
        if (dislike.article) {
            article.dislikes.push(dislikeDB);
            await article.save();
            res.json({
                ok: true,
                dislike: dislikeDB,
                article: article,
                usuario: usuario
            });  
        } else if (dislike.comment) {
            comment.dislikes.push(dislikeDB);
            await comment.save();
            res.json({
                ok: true,
                dislike: dislikeDB,
                comment: comment,
                usuario: usuario
            });  
        } else {
            res.json({
                ok: true,
                dislike: dislikeDB,
                usuario: usuario
            });  
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


const deleteDislike = async(req, res = response) => {
    const id = req.params.id;
    try {
        const dislikeDB = await Dislike.findById( id );
        if ( !dislikeDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un dislike con ese id'
            });
        }
        await Dislike.findByIdAndDelete( id );
        res.json({
            ok: true,
            msg: 'Dislike eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        }); 
    }
}


module.exports = {
    getDislikes,
    createDislike,
    deleteDislike
}






