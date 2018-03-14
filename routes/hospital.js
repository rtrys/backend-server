var express = require('express');
var Hospital = require('../models/hospital');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// =======================================
// Obtener todos los hospitales
// =======================================
app.get('/', (req, res, next) => {

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error al obtener los hospitales",
                    errs: err
                });
            }

            res.status(200).json({
                ok: true,
                hospitales: hospitales
            });
        });

});

// =======================================
// actualziar un hospital
// =======================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var usuario = req.usuario;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error al buscar el hospital"
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: "No se encuentra el hospital con ID: " + id,
                errs: { message: "No se encuentra el hospital con el ID: " + id }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: "Error al guardar el hospital",
                    errs: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});

// =======================================
// crear un nuevo hospital
// =======================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;
    var usuario = req.usuario;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "Error al guardar el hospital",
                errs: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});

// =======================================
// borrar un hospital
// =======================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error al borrar el hospital",
                errs: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = app;