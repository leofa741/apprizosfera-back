const { response } = require('express');
const Article = require('../models/article');



const getArticles = async(req, res) => {
    const desde = Number(req.query.desde) || 0;    
    await Promise.all([
        Article.countDocuments(),
        Article.find().populate('usuario', 'nombre email img')
                      .populate([
                        {
                          path: 'comments',
                          populate: [
                            {
                              path: 'usuario',
                              model: 'Usuario',
                              select: 'nombre email img'
                            },
                            {
                              path: 'likes',
                              model: 'Like',
                              select: 'usuario article date'
                            }
                          ]
                        },
                        {
                          path: 'likes',
                          model: 'Like',
                          select: 'usuario article date'
                        }
                      ])


                      .populate('likes', 'usuario article date')                  
            .skip( desde )
            .limit( 3)
            .sort({ date: 'desc' })
    ])
    .then( respuestas => {
        res.json({
            ok: true,
            articles: respuestas[1],
            total: respuestas[0]
        });
    });
}


const getLatestArticles= async(req, res) => {
    const last = req.params.last ;
try {
    const articles = await Article.find()
    .populate('usuario', 'nombre email img')
    .populate('comments', 'content date usuario likes ')    
    .populate('likes', 'usuario article date')
    .sort({ date: 'desc' })
    .limit(1)
  
    res.json({
        ok: true,
        articles
    });
}
catch (error) {
    console.log(error);
    res.status(500).json({
        ok: false,
        msg: 'Hable con el administrador'
    });
 }
}



const getArticle = async(req, res = response) => {
    const id = req.params.id;
    try {
        const article = await Article.findById( id )
                                .populate('usuario', 'nombre email img')
                                .populate([
                                    {
                                      path: 'comments',
                                      populate: [
                                        {
                                          path: 'usuario',
                                          model: 'Usuario',
                                          select: 'nombre email img'
                                        },
                                        {
                                          path: 'likes',
                                          model: 'Like',
                                          select: 'usuario article date'
                                        }
                                      ]
                                    },
                                    {
                                      path: 'likes',
                                      model: 'Like',
                                      select: 'usuario article date'
                                    }
                                  ])
                                .populate('likes', 'usuario article date');
        if ( !article ) {
            return res.status(404).json({
                ok: false,
                msg: 'Artículo no encontrado por id',
            });
        }
        res.json({
            ok: true,
            article            
        });        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })        
    }
}

const createArticle = async(req, res = response) => {    
        const article = new Article({
            usuario: req.uid,
            ...req.body
        });    
        try {
            const articleDB = await article.save();    
    
                res.json({
                    ok: true,
                    article: articleDB
                });  
    
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }    
    }

    const updateArticle = async(req, res = response) => {
        const id = req.params.id;    
        try {
            const articledb = await Article.findById( id );
            if ( !articledb ) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un artículo con ese id'
                });
            }
          // Actualizaciones del back
            const { usuario, ...campos } = req.body;
            if ( articledb.usuario.toString() !== req.uid ) {
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene privilegios de editar este artículo, no es el creador'
                });
            }
            campos.usuario = req.uid;

            const artticleactializado= await Article.findByIdAndUpdate( id, campos, { new: true } );

            res.json({
                ok: true,
                article: artticleactializado
            });

        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }
    }

    const deleteArticle = async(req, res = response) => {
        const id = req.params.id;
        const uid = req.uid;

        try {
            const articledb = await Article.findById( id );
            if ( !articledb ) {
                return res.status(404).json({
                    ok: false,
                    msg: 'No existe un artículo con ese id'
                });
            }
           
            if ( articledb.usuario.toString() !== uid ) {
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene privilegio de eliminar este artículo, no es el creadorr'
                });
            }
            await Article.findByIdAndDelete( id );
            res.json({
                ok: true,
                msg: 'Artículo eliminado'
            })
            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: true,
                msg: 'Hable con el administrador'
            })           
        }
    }

    module.exports = {
        getArticles,
        getArticle,
        createArticle,
        updateArticle,
        deleteArticle,
      getLatestArticles,
    }












