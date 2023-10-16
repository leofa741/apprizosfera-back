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

    const very = await googleVerify( req.body.token );
    const { name, email, picture } = very;

    // Verificar si el usuario existe en la BD

    const usuarioDB = await Usuario.findOne({ email });

    let usuario;

    if ( !usuarioDB ) {

        // Si no existe el usuario
        usuario = new Usuario({
            nombre: name,
            email,
            tipo: 'google',
            password: '@@@',
            img: picture,
            google: true,
            telefono: '0000000000'
        });
    }
    else {
        // Existe usuario
        usuario = usuarioDB;
        usuario.google = true;
        usuario.password = '@@@';
    }


    // Guardar en BD

    await usuario.save();

    // Generar el TOKEN - JWT

    const token = await generarJWT( usuario.id );

    res.json({  
        ok: true,
        name,
        email,
        picture,
        token
    })

    } catch (error) {
        console.log("errr",error);


    res.json({  
        ok: true,
        msg: 'Token no es correcto'
    })

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

