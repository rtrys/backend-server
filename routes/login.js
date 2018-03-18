var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;
const { OAuth2Client } = require('google-auth-library');

var app = express();
var Usuario = require('../models/usuario');


// =========================================
// autenticacion con google
// =========================================
app.post('/google', (req, res) => {

    var token = req.body.token;

    const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        //const domain = payload['hd'];

        Usuario.findOne({
            email: payload.email
        }, (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al buscar usuario",
                    errs: err
                });
            }

            if (usuario) {
                if (!usuario.google) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: "Usar autnticacion normal",
                        errs: { message: "Usuario creado con email y password, no con google" }
                    });
                } else {
                    // crear el token
                    usuario.password = "*****";
                    var token = jwt.sign({ usuario: usuario },
                        //SEED, { expiresIn: 14400 }); // debe expirar en 4 horas 
                        SEED, { expiresIn: 14400000000000 }); // debe expirar en saber cuanto tiempo 

                    return res.status(200).json({
                        ok: true,
                        usuario: usuario,
                        token: token,
                        id: usuario._id
                    });
                }

            } else {
                // No se ha encontrado ningun usuario con ese email

                var usuario = new Usuario({
                    nombre: payload.name,
                    email: payload.email,
                    password: "*****",
                    img: payload.picture,
                    google: true
                });

                usuario.save((err, usuario) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: "Error al crear usuario",
                            errs: err
                        });
                    }

                    // crear el token
                    usuario.password = "*****";
                    var token = jwt.sign({ usuario: usuario },
                        //SEED, { expiresIn: 14400 }); // debe expirar en 4 horas 
                        SEED, { expiresIn: 14400000000000 }); // debe expirar en saber cuanto tiempo 

                    return res.status(200).json({
                        ok: true,
                        usuario: usuario,
                        token: token,
                        id: usuario._id
                    });

                });

            }

        });
    }

    verify().catch(err => {
        console.log(err);
        res.status(400).json({
            ok: false,
            message: "no funciono",
            errs: err
        });
    });

});

// =========================================
// autenticacion normal
// =========================================
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error buscando usuarios",
                errs: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: "Credenciales incorrectas - email",
                errs: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                message: "Credenciales incorrectas - password",
                errs: err
            });
        }

        // crear el token
        usuarioDB.password = "*****";
        var token = jwt.sign({ usuario: usuarioDB },
            //SEED, { expiresIn: 14400 }); // debe expirar en 4 horas 
            SEED, { expiresIn: 14400000000000 }); // debe expirar en saber cuanto tiempo 

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });


});

module.exports = app;