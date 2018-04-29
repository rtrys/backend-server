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