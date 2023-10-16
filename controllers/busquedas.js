// getTodo

const { response } = require('express');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Article = require('../models/article');

const getTodo = async(req, res = response) => {
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda.toLowerCase(), 'i', 'o', 'í ', 'á', 'é', 'ó', 'ú' );
    if (isNaN(busqueda)) {
        const [ usuarios, productos, categorias ] = await Promise.all([
            Usuario.find({ nombre: regex }),
            Producto.find({ $or: [ { nombre: regex }, { descripcion: regex } ] })
            .populate('usuario', 'nombre img')
            .populate('categoria', 'nombre img'),
            Categoria.find({ $or: [ { nombre: regex } ] })   
        ]);
        res.json({
            ok: true,
            usuarios,
            productos,
            categorias
        });
    }
    if (!isNaN(busqueda)) {     

    const [ usuarios, productos, categorias ] = await Promise.all([
        Usuario.find({ nombre: regex }),
      
        Producto.find({ nombre: busqueda }),
           Categoria.find({ nombre: regex }),
    ]);
    res.json({
        ok: true,
        usuarios,
        productos,
        categorias
    });    
}
}

const getDocumentosColeccion = async(req, res = response) => {
    const tabla      = req.params.tabla;
    const busqueda   = req.params.busqueda;
    const regex      = new RegExp( busqueda, 'i' );
    let data = [];
    switch ( tabla ) {
        case 'categorias':
            data = await Categoria.find({ nombre: regex })
                                    .populate('usuario', 'nombre img');
        break;
        case 'productos':
        if (isNaN(busqueda)) {
            data = await Producto.find({nombre: regex })
                                    .populate('categoria', 'nombre img');
        }
        if (!isNaN(busqueda)) {
            data = await Producto.find({ precio: busqueda })
                                    .populate('categoria', 'nombre img');   
        }                                    
        break;  
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
        break;    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/productos/categorias'
            });
    }
    res.json({
        ok: true,
        resultados: data
    });
}

searchArticle  = async(req, res = response) => {
    const search = req.params.search;
    const regex = new RegExp( search, 'i' );
    try {
        const articles = await Article.find({ $or: [ { title: regex }, { content: regex } ] })      
        .sort({ date: 'desc' })
        .populate('usuario', 'nombre email img')
        .populate('comments', 'content date usuario likes ')    
        .populate('likes', 'usuario article date')
        
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



module.exports = {
    getTodo,
    getDocumentosColeccion,
    searchArticle 
}

// Compare this snippet from routes\busquedas.js:
