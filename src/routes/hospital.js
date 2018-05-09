const express = require('express');
const Hospital = require('../models/hospital');
const { verifyUserToken } = require('../middlewares/auth');

const app = express();

// =======================================
// GET all hospitals
// =======================================
app.get('/', (req, res) => {

    const from = Number(req.query.desde || 0);

    Hospital.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .exec((err, hospitals) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            Hospital.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    payload: {
                        hospitals: hospitals,
                        total: count
                    }
                });
            });
        });

});

// =======================================
// GET specific hospital
// =======================================
app.get('/:id', (req, res) => {

    const id = req.params.id;

    Hospital.findById(id)
        .populate('user', 'name img email')
        .exec((err, hospital) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: `Hospital with ID ${id} do not exist`,
                    errs: { message: `Hospital with ID ${id} do not exist` }
                });
            }

            res.status(200).json({
                ok: true,
                payload: hospital
            });
        });

});

// =======================================
// update an hospital
// =======================================
app.put('/:id', verifyUserToken, (req, res) => {

    const id = req.params.id;
    const user = req.user;
    const body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error'
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: `Hospital with ID ${id} do not exist`,
                errs: { message: `Hospital with ID ${id} do not exist` }
            });
        }

        hospital.name = body.name;
        hospital.user = user._id;

        hospital.save((err, savedHospital) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error',
                    errs: err
                });
            }

            res.status(200).json({
                ok: true,
                payload: savedHospital
            });
        });
    });
});

// =======================================
// create a nue hospital
// =======================================
app.post('/', verifyUserToken, (req, res) => {

    const body = req.body;
    const user = req.user;

    const hospital = new Hospital({
        name: body.name,
        user: user._id
    });

    hospital.save((err, savedHospital) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        res.status(201).json({
            ok: true,
            payload: savedHospital
        });
    });
});

// =======================================
// delete an hospital
// =======================================
app.delete('/:id', verifyUserToken, (req, res) => {

    const id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, deletedHospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error',
                errs: err
            });
        }

        res.status(200).json({
            ok: true,
            payload: deletedHospital
        });
    });
});

module.exports = app;