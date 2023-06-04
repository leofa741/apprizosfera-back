
const fs = require('fs');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL);

const actualizarImagen = async (tipo, id, path , nombreArchivo) => {

    switch (tipo) {

        case 'usuarios':

            const usuario = await Usuario.findById(id);

            if (!usuario) {
                console.log('No es un usuario por id');
                return false;
            }

            const pathViejo = `./uploads/usuarios/${usuario.img}`;
            actualizarImagen(pathViejo, path);

           if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            await usuario.save();  
          return true;

        break;

        case 'productos':

        const productos = await Producto.findById(id);

        if (!productos) {
            console.log('No es un productos por id');
            return false;
        }

        const pathViejoproductos = `./uploads/productos/${productos.img}`;
        actualizarImagen(pathViejoproductos, path);

       if (fs.existsSync(pathViejoproductos)) {
            fs.unlinkSync(pathViejoproductos);
        }

        productos.img = nombreArchivo;

        await productos.save();  
      return true;

        break;

        case 'categorias':

        const categorias = await Categoria.findById(id);

        if (!categorias) {
            console.log('No es un productos por id');
            return false;
        }

        const pathViejocategorias = `./uploads/categorias/${categorias.img}`;
        actualizarImagen(pathViejocategorias, path);

       if (fs.existsSync(pathViejocategorias)) {
            fs.unlinkSync(pathViejocategorias);
        }

        categorias.img = nombreArchivo;

        await categorias.save();
      return true;        

        break;

        default:

        break;

   

    
}

}

const actualizarImagenCloudinary = async (tipo, id, path , nombreArchivo) => {

    switch (tipo) {

        case 'usuarios':

            const usuario = await Usuario.findById(id);

            if (!usuario) {
                console.log('No es un usuario por id');
                return false;
            }

            const pathViejo = `./uploads/usuarios/${usuario.img}`;
            actualizarImagen(pathViejo, path);

           if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            await usuario.save();  
          return true;

        break;

        case 'productos':

        const productos = await Producto.findById(id);

        if (!productos) {
            console.log('No es un productos por id');
            return false;
        }

        const pathViejoproductos = `./uploads/productos/${productos.img}`;
        actualizarImagen(pathViejoproductos, path);

       if (fs.existsSync(pathViejoproductos)) {
            fs.unlinkSync(pathViejoproductos);
        }

        productos.img = nombreArchivo;

        await productos.save();  
      return true;

        break;

        case 'categorias':

        const categorias = await Categoria.findById(id);

        if (!categorias) {
            console.log('No es un productos por id');
            return false;
        }

        const pathViejocategorias = `./uploads/categorias/${categorias.img}`;
        actualizarImagen(pathViejocategorias, path);

       if (fs.existsSync(pathViejocategorias)) {
            fs.unlinkSync(pathViejocategorias);
        }

        categorias.img = nombreArchivo;

        await categorias.save();
      return true;        

        break;

        default:

        break;

   

    
}

}



module.exports = {
    actualizarImagen,
    actualizarImagenCloudinary
}
