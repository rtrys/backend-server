var express = require('express');
var Medico = require('../models/medico');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// =======================================
// Obtener todos los medicos
// =======================================
app.get('/', (req, res) => {

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error al buscar los medicos",
                    errs: err
                });
            }

            res.status(200).json({
                ok: true,
                medicos: medicos
            });
        });
});

// =======================================
// Editar un medico
// =======================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var usuario = req.usuario;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Erro al buscar el medico",
                errs: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                message: "No es encuentr el medico con ID " + id,
                errs: { message: "No se encuentra el medico con el ID " + id }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: "No se puedo actualizar el medico",
                    errs: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });

    });

});

// =======================================
// Crear un medico
// =======================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var usuario = req.usuario;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "No es posible crear el medico",
                errs: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});

// =======================================
// Borrar un medico
// =======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error al borrar el medico",
                errs: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });

});

module.exports = app;