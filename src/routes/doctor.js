const express = require('express');
const Doctor = require('../models/doctor');
const { verifyUserToken } = require('../middlewares/auth');

const app = express();

// =======================================
// Get all doctors
// =======================================
app.get('/', (req, res) => {

    const from = Number(req.query.desde || 0);

    Doctor.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec((err, doctors) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            Doctor.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    doctors: doctors,
                    total: count
                });
            });
        });
});

// =======================================
// Obtener todos los medicos
// =======================================
app.get('/:id', (req, res) => {

    const id = req.params.id;

    Doctor.findById(id)
        .populate('user', 'name email img')
        .populate('hospital')
        .exec((err, doctor) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            if (!doctor) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error',
                    errs: { message: 'Error' }
                });
            }

            return res.status(200).json({
                ok: true,
                doctor
            });

        });

});

// =======================================
// Edit a doctor
// =======================================
app.put('/:id', verifyUserToken, (req, res) => {

    const id = req.params.id;
    const user = req.user;
    const body = req.body;

    Doctor.findById(id, (err, doctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        if (!doctor) {
            return res.status(400).json({
                ok: false,
                message: 'Error',
                errs: { message: 'Error'}
            });
        }

        doctor.name = body.name;
        doctor.user = user._id;
        doctor.hospital = body.hospital;

        doctor.save((err, savedDoctor) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            res.status(200).json({
                ok: true,
                doctor: savedDoctor
            });
        });

    });

});

// =======================================
// Create a doctor
// =======================================
app.post('/', verifyUserToken, (req, res) => {

    const body = req.body;
    const user = req.user;

    const doctor = new Doctor({
        name: body.name,
        user: user._id,
        hospital: body.hospital
    });

    doctor.save((err, savedDoctor) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        res.status(201).json({
            ok: true,
            doctor: savedDoctor
        });
    });
});

// =======================================
// Delete doctor
// =======================================
app.delete('/:id', verifyUserToken, (req, res) => {

    const id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, deletedDoctor) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        res.status(200).json({
            ok: true,
            doctor: deletedDoctor
        });
    });

});

module.exports = app;