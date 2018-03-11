// require
var express = require('express');
var mongoose = require('mongoose');

// inicializar variables
var app = express();

// conexion a db
mongoose.connection
    .openUri('mongodb://root:toor@ds163918.mlab.com:63918/hospitaldb', (err, res) => {
        if (err) throw err;
        console.log('DB mongo \x1b[32m%s\x1b[0m', 'online');
    });

// rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: "Peticion realizada correctamente"
    });
});

// listener de peticiones
app.listen(process.env.PORT || 3000, () => {
    console.log('Express corriendo en  puerto \x1b[32m%s\x1b[0m', '3000');
});