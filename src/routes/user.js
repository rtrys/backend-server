const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mdAuth = require('../middlewares/auth');

const app = express();


// =======================================
// GET all users
// =======================================
app.get('/', (req, res) => {

    var desde = Number(req.query.desde || 0);

    User.find({}, 'name email img role google')
        .skip(desde)
        .limit(5)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error getting users',
                    errs: err
                });
            }

            User.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });
            });
        });
});

// =======================================
// actualizar usuario
// =======================================
app.put('/:id', [mdAuth.verificaToken, mdAuth.verificaAdminRoleOMismoUsuario], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errs: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: `El usuario con id ${id} no existe`,
                errs: { message: 'no existe un usuario con este Id' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error actualizando usuario',
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
// Crear un nuevo usuario
// =======================================
app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new User({
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
                message: 'Error creando usuario',
                errs: err
            });
        }

        usuarioGuardado.password = '*****';

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado
        });
    });

});

// =======================================
// borrar usuario
// =======================================
app.delete('/:id', [mdAuth.verificaToken, mdAuth.verificaAdminRole], (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar usuario',
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