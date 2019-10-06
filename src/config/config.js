// response
const statusOK = (res, message, data) => {
    res.status(200).json({
        ok: true,
        message: (message || 'Successful'),
        data: (data || {})
    });
}

const statusError = (res, message, data) => {
    res.status(500).json({
        ok: true,
        message: (message || 'Successful'),
        errs: (err || { message: 'Error into the server' })
    });
}

const statusBadRequest = (res, message, data) => {
    res.status(400).json({
        ok: true,
        message: (message || 'Successful'),
        errs: (err || { message: 'Bad Request' })
    });
}


module.exports = {
    statusOK,
    statusError,
    statusBadRequest
};
