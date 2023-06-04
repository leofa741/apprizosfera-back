// uploadFile  getImagen

const { response } = require('express');
const { generarJWT } = require('../helpers/jwt');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const { actualizarImagen } = require('../helpers/actualizar-imagen');


const uploadFile = async(req, res = response) => {
    const { tipo, id } = req.params;

    // Validar tipo
    const tiposValidos = ['productos', 'usuarios', 'categorias'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            msg: 'No es un tipo valido'
        })
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            msg: 'No hay ningun archivo'
        })
    }

    // Procesar la imagen

    const file = req.files.imagen;
    const nombreCortado = file.name.split('.'); // Separar el nombre del archivo por el punto
    const extensionArchivo = nombreCortado[nombreCortado.length - 1]; // Obtener la extension del archivo

    // Validar extension

    const extensionesValidas = ['png','PNG', 'jpg','JPG', 'jpeg', 'gif'];

    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            msg: 'No es una extension valida'
        })
    }

    // Generar el nombre del archivo

    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
    // Path para guardar la imagen

    const path = `/uploads/${tipo}/${nombreArchivo}`;
    // Mover la imagen

    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                msg: 'Error al mover la imagen',err
                
            })
        }

        // Actualizar base de datos

        actualizarImagen(tipo, id,path ,nombreArchivo);

        res.json({
            msg: 'Archivo subido correctamente',
            nombreArchivo
        })

    });

}

const mostrarImagen = async(req, res = response) => {

    const { tipo, foto } = req.params;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);


   // Imagen por defecto

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);

    }

}

     


module.exports = {
    uploadFile,
    mostrarImagen
}
