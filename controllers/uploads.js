// uploadFile  getImagen
require('dotenv').config();
const { response } = require('express');

const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL);




const uploadFile = async(req, res = response) => {
    const { tipo, id } = req.params;

    // Validar tipo
    const tiposValidos = ['productos', 'usuarios', 'categorias' ,'articulos'];

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
   const path = `./uploads/${tipo}/${nombreArchivo}`;
   // Mover la imagen
    file.mv(path, (err) => {        
        if (err) {
            console.log(err);
            return res.status(500).json({
                msg: 'Error al mover la imagen',err,path                
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


const uploadFileCloud = async(req, res = response) => {
    const { tipo, id } = req.params;

    // Validar tipo
    const tiposValidos = ['productos', 'usuarios', 'categorias','articulos'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            msg: 'No es un tipo valido'
        })
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            msg: 'No hay ningun archivo cargado'
        })
    }
 
   try {
    const {tempFilePath} = req.files.imagen
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath,{folder:tipo});
    const nombreArchivo = secure_url;
    actualizarImagen(tipo, id,nombreArchivo);
    res.json({
        msg: 'Archivo subido correctamente',
        nombreArchivo
    })

   }    catch (error) {      
        console.log(error);
        res.status(500).json({
            msg: 'Error al subir la imagen',
            error
        })
    }
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
    mostrarImagen,
    uploadFileCloud
 
}
