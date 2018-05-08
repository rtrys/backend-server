// require modules
const express           = require('express');
const mongoose          = require('mongoose');
const bodyParser        = require('body-parser');

// my routes
const userRoutes        = require('./routes/user');
const hospitalRoutes    = require('./routes/hospital');
const doctorRoutes      = require('./routes/doctor');
const searchRoutes      = require('./routes/search');
const loginRoutes       = require('./routes/login');
const uploadRoutes      = require('./routes/upload');
const imageRoutes       = require('./routes/images');
const appRuotes         = require('./routes/app');

// initialization variables
const app = express();

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

// body parser
// parse application/x-www-form-urlencoded and JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conection DB to MLab
mongoose.connection
    .openUri(`mongodb://${process.env.MONGO_AUTH}@${process.env.MONGO_HOST}`, (err, res) => {
        if (err) throw err;
        console.log('DB mongo \x1b[32m%s\x1b[0m', 'online');
    });

// routes
app.use('/user', userRoutes);
app.use('/doctor', doctorRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/login', loginRoutes);
app.use('/img', imageRoutes);
app.use('/', appRuotes);

// listener de peticiones
app.listen(process.env.PORT || 3000, () => {
    console.log('Express corriendo en  puerto \x1b[32m%s\x1b[0m', '3000');
});

module.exports = app;