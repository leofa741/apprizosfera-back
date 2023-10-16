const { response } = require('express');
const Comment = require('../models/comments');
const Article = require('../models/article');
const Usuario = require('../models/usuario');

const getComments = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    
    await Promise.all([
        Comment.countDocuments(),
        Comment.find().populate('usuario', 'nombre email img')
                    .populate('article', 'title content date usuario likes ')
                    .populate('likes', 'usuario article date')
                  
            .skip( desde )
            .limit( 10 )
    ])
    .then( respuestas => {

        res.json({
            ok: true,
            comments: respuestas[1],
            total: respuestas[0]
        });

    });
}

const createComment = async(req, res = response) => {
    
    const comment = new Comment({
        usuario: req.uid,      

        ...req.body
    });

    try {
        const commentDB = await comment.save();     
        const article = await Article.findById(comment.article);       
        article.comments.push(commentDB);

        await article.save();        
        res.json({
                ok: true,
                comment: commentDB
            });  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}




const deleteComment = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    try {
        const comment = await Comment.findById( id );
        if ( !comment ) {
            return res.status(404).json({
                ok: true,
                msg: 'Comentario no existe'
            });
        }

        if ( comment.usuario.toString() !== uid ) {
            return res.status(401).json({
                ok: true,
                msg: 'No tiene privilegio de eliminar este comentario'
            });
        }

        await Comment.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Comentario eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: 'Hable con el administrador'
        })
    }   
}

const updateComment = async(req, res = response) => {
    const id = req.params.id; 
    try {
        const commentsdb = await Comment.findById( id );
        if ( !commentsdb ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un comentario con ese id'
            });
        }
        const { usuario, ...campos } = req.body;
        if ( commentsdb.usuario.toString() !== req.uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este comentario, no es el creador'
            });
        }
        campos.usuario = req.uid;
        const commentsactualizado = await Comment.findByIdAndUpdate( id, campos, { new: true } );
        res.json({
            ok: true,
            comment: commentsactualizado
        });

    }   catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }   

}


module.exports = {
    getComments,
    createComment,
    deleteComment,
    updateComment
}


