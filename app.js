// require
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// importamos rutas
var usuarioRuotes = require('./routes/usuario');
var appRuotes = require('./routes/app');

// inicializar variables
var app = express();

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// conexion a db
mongoose.connection
    .openUri('mongodb://root:toor@ds163918.mlab.com:63918/hospitaldb', (err, res) => {
        if (err) throw err;
        console.log('DB mongo \x1b[32m%s\x1b[0m', 'online');
    });

// rutas
app.use('/usuario', usuarioRuotes);
app.use('/', appRuotes);

// listener de peticiones
app.listen(process.env.PORT || 3000, () => {
    console.log('Express corriendo en  puerto \x1b[32m%s\x1b[0m', '3000');
});