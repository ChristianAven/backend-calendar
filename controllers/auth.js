const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response)=>{

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({email});

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            });
        }
        usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save(); 

        //generar jwt
        const token = await generarJWT(usuario.id, usuario.name)


        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Fallo interno'
        })
    }
    
} 


const loginUsuario = async(req, res = response)=>{

    const { email, password } = req.body

    try {

        const usuario = await Usuario.findOne({email})

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El email no existe'
            });
        }

        // confirmar los passwords
        const valiPassword = bcrypt.compareSync(password, usuario.password)

        if (!valiPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar nuesto JWT
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


        
    } catch (e) {
        res.status(500).json({
            ok: false,
            msg: 'Fallo interno'
        })
    }
}

const revalidarToken = async(req, res = response)=>{

    const {uid, name} = req;

    const token = await generarJWT(uid, name)


    res.json({
        ok:true,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}