const { response } = require('express');
const bcrypt = require('bcryptjs');
const { googleVerify } = require('../helpers/google-verify');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');




const login = async( req, res = response ) => {
    const { email, password } = req.body;

    try {        
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }
        // Generar el TOKEN - JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token,
            usuario: usuarioDB
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}



const googleSignIn = async( req, res = response ) => {

    try {
        const googleUser = await googleVerify( req.body.token );
        const { email, name, picture } = googleUser;
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            // Si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                telefono,
                password: '@@@',
                img: picture,
                google: true

            });
        } else {
            // Existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en DB
        await usuario.save();
        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        return  res.status(200).json({  
        ok: true,
        msg: googleUser,
        token
    })

}
    catch (error) {

        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }         

}


const renewToken = async( req, res = response ) => {
      const uid = req.uid;

      // Generar el TOKEN - JWT
      const token = await generarJWT( uid );

      // Obtener el usuario por UID
      const usuario = await Usuario.findById( uid );

      res.json({
          ok: true,
          token,
          usuario
      })

}






module.exports = {
    login,
    googleSignIn,
    renewToken
}

