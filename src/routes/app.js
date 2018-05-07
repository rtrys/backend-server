const express = require('express');
const { statusOK } = require('../config/config');

const app = express();

app.get('/', (req, res) => {
    statusOK(res);
});

module.exports = app;
