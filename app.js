// require
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// importamos rutas
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var loginRoutes = require('./routes/login');
var uploadRoutes = require('./routes/upload');
var appRuotes = require('./routes/app');
var imagenRoutes = require('./routes/imagenes');

// inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// conexion a db
mongoose.connection
    .openUri('mongodb://root:toor@ds163918.mlab.com:63918/hospitaldb', (err, res) => {
        if (err) throw err;
        console.log('DB mongo \x1b[32m%s\x1b[0m', 'online');
    });

/*
// confugracion del serve index
// configuracion de ejemplo
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));
*/

// rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/', appRuotes);

// listener de peticiones
app.listen(process.env.PORT || 3000, () => {
    console.log('Express corriendo en  puerto \x1b[32m%s\x1b[0m', '3000');
});