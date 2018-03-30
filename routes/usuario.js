var express = require('express');
var Usuario = require('../models/usuario');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


// =======================================
// Obtener todos los usuarios
// =======================================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(3)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando usuarios',
                    errs: err
                });
            }

            Usuario.count({}, (err, conteo) => {
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
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

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
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

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