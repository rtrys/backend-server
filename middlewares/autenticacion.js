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
                message: 'Token incorrecto',
                errs: err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

// =======================================
// Verificar usuario
// =======================================
module.exports.verificaAdminRole = function(req, res, next) {

    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Role incorrecto',
            errs: { message: 'No es administrador' }
        });
    }
};

// =======================================
// Verificar usuario
// =======================================
module.exports.verificaAdminRoleOMismoUsuario = function(req, res, next) {

    let usuario = req.usuario;
    let id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || id === usuario._id) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Role incorrecto',
            errs: { message: 'No es administrador' }
        });
    }
};