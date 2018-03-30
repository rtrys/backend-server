var express = require('express');
var fs = require('fs');

var app = express();

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var path = `./uploads/${tipo}/${img}`;

    fs.exists(path, exists => {

        if (!exists) {
            path = './assets/no-img.jpg';
        }

        res.sendfile(path);
    });

});

module.exports = app;