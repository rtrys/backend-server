const express = require('express');
const fileupload = require('express-fileupload');
const fs = require('fs');

const Usuario = require('../models/user');
const Medico = require('../models/doctor');
const Hospital = require('../models/hospital');

const app = express();

app.use(fileupload());

app.put('/:type/:id', (req, res, next) => {

    const type = req.params.type;
    const id = req.params.id;

    const colections = ['hospitals', 'doctors', 'usuers'];
    if (colections.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid type',
            errs: { message: 'Invalid type' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No file selected',
            errs: { message: 'No file selected' }
        });
    }

    // get file name
    const file = req.files.image;
    const fileSplit = file.name.split('.');
    const fileExt = fileSplit[fileSplit.length - 1];
    const validExts = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExts.indexOf(fileExt) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Invalid extension',
            errs: { message: 'The valid extension are: ' + validExts.join(', ') }
        });
    }

    // nombre de archivo personalizado
    const fileName = `${id}-${new Date().getMilliseconds()}.${fileExt}`;

    // de acuerdo a la documentacion hay que mover el archivo
    const path = `./uploads/${type}/${fileName}`;

    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error to move file',
                errs: err
            });
        }
        uploadByType(type, id, fileName, res);
    });
});

function uploadByType(type, id, fileName, res) {

    switch (type) {
        case 'users':
            Usuario.findById(id, (err, foundUser) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error',
                        errs: err
                    });
                }

                if (!foundUser) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error',
                        errs: { message: 'Error' }
                    });
                }

                deleteIamgeIfExists(foundUser.img);

                foundUser.img = fileName;
                foundUser.save((err, updatedUser) => {
                    updatedUser.password = '*******';
                    return res.status(200).json({
                        ok: true,
                        message: 'Image updated',
                        user: updatedUser
                    });
                });

            });
            break;

        case 'doctors':
            Medico.findById(id, (err, foundDoctor) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error',
                        errs: err
                    });
                }

                if (!foundDoctor) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error',
                        errs: { message: 'Error' }
                    });
                }

                deleteIamgeIfExists(foundDoctor.img);

                foundDoctor.img = fileName;
                foundDoctor.save((err, updatedDoctor) => {
                    return res.status(200).json({
                        ok: true,
                        message: 'Image updated',
                        doctor: updatedDoctor
                    });
                });

            });
            break;
    
        case 'hospitals':
            Hospital.findById(id, (err, foundHospital) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error',
                        errs: err
                    });
                }

                if (!foundHospital) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error',
                        errs: { message: 'Error' }
                    });
                }

                deleteIamgeIfExists(foundHospital.img);

                foundHospital.img = fileName;
                foundHospital.save((err, updatedHospital) => {
                    return res.status(200).json({
                        ok: true,
                        message: 'Image updated',
                        hospital: updatedHospital
                    });
                });

            });
            break;

        default:
        break;
    }
}

function deleteIamgeIfExists(fileName) {

    const oldPath = `./uploads/${type}/${fileName}`;

    if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, err => null);
        return true;
    } else {
        return false;
    }
}

module.exports = app;