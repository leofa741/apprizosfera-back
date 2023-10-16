const { response } = require('express');
const Like = require('../models/likes');
const Usuario = require('../models/usuario');
const Article = require('../models/article');
const Comment = require('../models/comments');

const getLikes = async(req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    
    await Promise.all([
        Like.countDocuments(),
        Like.find().populate('usuario', 'nombre email img')
                   .populate('article', 'title content date usuario comments likes dislikes')
                   .populate('comment', 'content date usuario article likes dislikes')
            .skip( desde )
            .limit( 10 )
    ])
    .then( respuestas => {

        res.json({
            ok: true,
            likes: respuestas[1],
            total: respuestas[0]
        });
    });
}


const createLike = async(req, res = response) => {

        const like = new Like({
            usuario: req.uid,
            ...req.body
        });

        //limitar a un solo like por usuario
        const usuario = await Usuario.findById(like.usuario);
        const article = await Article.findById(like.article);
        const comment = await Comment.findById(like.comment);
        if (like.article) {
            const liked = await Like.find({usuario: like.usuario, article: like.article});
            if (liked.length > 0) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario ya ha dado like a este articulo'
                });
            }
        }   
             
       
            try {
            const likeDB = await like.save();    
            const usuario = await Usuario.findById(like.usuario);
            const article = await Article.findById(like.article);
            const comment = await Comment.findById(like.comment);
            if (like.article) {
                article.likes.push(likeDB);
                await article.save();
                res.json({
                    ok: true,
                    like: likeDB,
                    article: article,
                    usuario: usuario
                });  
            } else if (like.comment) {
                comment.likes.push(likeDB);
                await comment.save();
                res.json({
                    ok: true,
                    like: likeDB,
                    comment: comment,
                    usuario: usuario
                });  
            } else {
                res.json({
                    ok: true,
                    like: likeDB,
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

const deleteLike = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    try {
        const likedb = await Like.findById( id );
        if ( !likedb ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un like con ese id'
            });
        }
        if ( likedb.usuario.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este like, no es el creador'
            });
        }
        await Like.findByIdAndDelete( id );
        res.json({
            ok: true,
            msg: 'Like eliminado'
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
        getLikes,
        createLike,
        deleteLike
    }


