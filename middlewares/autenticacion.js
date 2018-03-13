var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;


// =======================================
// Verificar usuario
// =======================================
module.exports.verificaToken = function(req, res, next) {

    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: "Token incorrecto",
                errs: err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}