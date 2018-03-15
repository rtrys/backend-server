var express = require('express');
var fileupload = require('express-fileupload');

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

        subirPorTipo(tipo, id, path, res);
    });
});

function subirPorTipo(tipo, id, path, res) {

    if (tipo === 'usuarios') {

    }

    if (tipo === 'medicos') {

    }

    if (tipo === 'hospitales') {

    }

    res.status(200).json({
        ok: true,
        message: "Archivo movido"
    });
}

module.exports = app;