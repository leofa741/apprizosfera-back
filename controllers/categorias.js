const Categoria = require('../models/categoria');
const { response } = require('express');



const getCategorias = async(req, res) => {  
    const desde = Number(req.query.desde) || 0;
    
    await Promise.all([
        Categoria.countDocuments(),
        Categoria.find().populate('usuario', 'nombre img')
            .skip( desde )
            .limit( 10 )
    ])
    .then( respuestas => {

        res.json({
            ok: true,
            categorias: respuestas[1],
            total: respuestas[0]
        });

    });
}



const crearCategoria = async(req, res = response) => {

    const categoria = new Categoria({
        usuario: req.uid,
        ...req.body
    });

    try {
        const categoriaDB = await categoria.save();    

               res.json({
                   ok: true,
                   categoria: categoriaDB
               });  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}



const actualizarCategoria = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const categoriaDB = await Categoria.findById(uid);

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una categoria con ese id'
            });
        }

        // Actualizaciones

        const { nombre, ...campos } = req.body;

        if (categoriaDB.nombre !== nombre) {
            const existeNombre = await Categoria.findOne({ nombre });
            if (existeNombre) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe una categoria con ese nombre'
                });
            }
        }

        campos.nombre = nombre;

        const categoriaActualizada = await Categoria.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            categoria: categoriaActualizada
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }   
}




const borrarCategoria = async(req, res = response) => {

    const uid = req.params.id;

    try {
        const categoriaDB = await Categoria.findById(uid);

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una categoria con ese id'
            });
        }

        await Categoria.findByIdAndDelete(uid);

        res.json({  
            ok: true,
            msg: 'Categoria eliminada'
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
    getCategorias,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}
// Compare this snippet from routes\categorias.js:
