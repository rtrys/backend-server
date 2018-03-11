var express = require('express');
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');

var app = express();

// =======================================
// Obtener todos los usuarios
// =======================================
app.get('/', (req, res) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: "Error cargando usuarios",
                        errs: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    message: "get de usuarios",
                    usuarios: usuarios
                });
            });

});

// =======================================
// Obtener todos los usuarios
// =======================================
app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "Error creando usuario",
                errs: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    });

});

// =======================================
// actualizar usuario
// =======================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error al buscar usuario",
                errs: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: "El usuario con id " + id + " no existe",
                errs: { message: "no existe un usuario con este Id" }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: "Error actualizando usuario",
                    errs: err
                });
            }

            usuarioGuardado.password = '*******';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});

// =======================================
// borrar usuario
// =======================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error al borrar usuario",
                errs: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;