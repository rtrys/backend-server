const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.get('/:type/:img', (req, res, next) => {

    const type = req.params.type;
    const img = req.params.img;

    const imgPath = path.resolve(__dirname, `../uploads/${type}/${img}`);

    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath);
    } else {
        res.sendFile(path.resolve(__dirname, './assets/no-img.jpg'));
    }

});

module.exports = app;