var express = require('express');
var response = require('../config/config').response;

var app = express();

app.get('/', (req, res) => {
    response.statusOK(res);
});

module.exports = app;