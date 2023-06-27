// getTodo

const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

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


module.exports = {
    getTodo,
    getDocumentosColeccion

}

// Compare this snippet from routes\busquedas.js:
