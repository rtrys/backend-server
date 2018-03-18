// JWT token seed
module.exports.SEED = "Este-es-el-seed@con-Simbolos";

// google
module.exports.GOOGLE_CLIENT_ID = "684708854038-tp79ionfpk7kug1f3h2vejpjgu7bm30g.apps.googleusercontent.com"
module.exports.GOOGLE_SECRET = "2JkBUu3G9qe6JLHgUEOXQoaT";

// response
module.exports.response = {
    statusOK: function(res, message, data) {
        res.status(200).json({
            ok: true,
            message: (message || 'Peticion realizada con exito!'),
            data: (data || {})
        });
    },
    statusError: function(res, message, err) {
        res.status(500).json({
            ok: true,
            message: (message || 'Peticion realizada con exito!'),
            errs: (err || { message: 'Error en el servidor' })
        });
    },
    statusBadRequest: function(res, message, err) {
        res.status(400).json({
            ok: true,
            message: (message || 'Peticion realizada con exito!'),
            errs: (err || { message: 'Error en los datos enviados al servidor' })
        });
    }
};