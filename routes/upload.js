var express = require('express');
var fileupload = require('express-fileupload');
var fs = require('fs');

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

var app = express();

app.use(fileupload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    var colecciones = ['hospitales', 'medicos', 'usuarios'];
    if (colecciones.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: "No selecciono un tipo valido",
            errs: { message: "Debe selecionar un tipo valido" }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: "No selecciono ningun archivo",
            errs: { message: "Debe selecionar una imagen" }
        });
    }

    // get file name
    var file = req.files.imagen;
    var splitFile = file.name.split('.');
    var extFile = splitFile[splitFile.length - 1];
    var extsValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extsValidas.indexOf(extFile) < 0) {
        return res.status(400).json({
            ok: false,
            message: "Extencion no valida",
            errs: { message: "las extenciones validas son: " + extsValidas.join(', ') }
        });
    }

    // nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extFile}`;

    // de acuerdo a la documentacion hay que mover el archivo
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error al mover el archivo",
                errs: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuarioEncontrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error al buscar al usuario",
                    errs: err
                });
            }

            if (!usuarioEncontrado) {
                return res.status(400).json({
                    ok: false,
                    message: "Usuario nulo",
                    errs: { message: "Usuario nulo" }
                });
            }

            deleteIamgeIfExists(usuarioEncontrado.img);

            usuarioEncontrado.img = nombreArchivo;
            usuarioEncontrado.save((err, usuarioActualizado) => {
                usuarioActualizado.password = "*******";
                return res.status(200).json({
                    ok: true,
                    message: "Imagen de usuario actualizado",
                    usuario: usuarioActualizado
                });
            });

        });
    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medicoEncontrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error al buscar al medico",
                    errs: err
                });
            }

            if (!medicoEncontrado) {
                return res.status(400).json({
                    ok: false,
                    message: "Medico nulo",
                    errs: { message: "Medico nulo" }
                });
            }

            deleteIamgeIfExists(medicoEncontrado.img);

            medicoEncontrado.img = nombreArchivo;
            medicoEncontrado.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    message: "Imagen de medico actualizado",
                    usuario: medicoActualizado
                });
            });

        });
    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospitalEncontrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: "Error al buscar al hospital",
                    errs: err
                });
            }

            if (!hospitalEncontrado) {
                return res.status(400).json({
                    ok: false,
                    message: "hospital nulo",
                    errs: { message: "hospital nulo" }
                });
            }

            deleteIamgeIfExists(hospitalEncontrado.img);

            hospitalEncontrado.img = nombreArchivo;
            hospitalEncontrado.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    message: "Imagen de hospital actualizado",
                    usuario: hospitalActualizado
                });
            });

        });
    }

}

function deleteIamgeIfExists(fileName) {

    var pathViejo = './uploads/hospitales/' + fileName;

    if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo, err => null);
        return true;
    } else {
        return false;
    }
}

module.exports = app;