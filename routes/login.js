var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

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