
const Usuario = require('../models/usuario');
const { response } = require('express');

const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;

    // const usuarios = await  Usuario
    //     .find({}, 'nombre email role google')
    //     .skip( desde )
    //     .limit( 6 );

    // const total = await Usuario.count();

    await Promise.all([
        Usuario.countDocuments(),
        Usuario.find({}, 'nombre email rol google img')
            .skip( desde )
            .limit( 6 )
    ])
    .then( respuestas => {      

        res.json({
            ok: true,
            usuarios: respuestas[1],
            total: respuestas[0]
        });

    });

   
}



const getUsuario = async(req, res = response) => {  
    const id = req.params.id;
    try {
        const usuario = await Usuario.findById( id )                             
        if ( !usuario ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        res.json({
            ok: true,
            usuario: usuario
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
     }
}
   

const crearUsuario = async(req, res = response) => {
    const { email, password } = req.body;
    const usuario = new Usuario(req.body);

        try {

            const existeEmail = await Usuario.findOne({ email: email });

            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
            msg: 'El correo ya está registrado'
                });
            }

            // Encriptar contraseña
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync(password, salt);
            
            await usuario.save();

            const token = await generarJWT( usuario.id );

            res.json({
                ok: true,
                usuario: usuario,
                token: token
            });

        }
        catch (error) {

            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Error inesperado... revisar logs'
            });

        }
}


const actualizarUsuario = async (req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById( uid );
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if ( usuarioDB.email !== email ) {

            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }        
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}


const borrarUsuario = async(req, res = response ) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById( uid );
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
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
    getUsuarios,
    getUsuario,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
   
}
