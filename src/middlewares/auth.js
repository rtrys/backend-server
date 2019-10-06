const jwt = require('jsonwebtoken');

// =======================================
// verify user token
// =======================================
const verifyUserToken = function(req, res, next) {

    const token = req.query.token;
    jwt.verify(token, process.env.JWT_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Invalid Token',
                errs: err
            });
        }

        req.user = decoded.user;
        next();
    });
};

// =======================================
// verify admin user role
// =======================================
const verifyAdminUserRole = function(req, res, next) {

    const user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Invalid role',
            errs: { message: 'It is not an administrator' }
        });
    }
};

// =======================================
// verify admin role on my own user
// =======================================
const verifyAdminRolOnMyOwnUser = function(req, res, next) {

    const user = req.user;
    const id = req.params.id;

    if (user.role === 'ADMIN_ROLE' || id === user._id) {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Invalid role',
            errs: { message: 'It is not an administrator' }
        });
    }
};


module.exports = {
    verifyUserToken,
    verifyAdminUserRole,
    verifyAdminRolOnMyOwnUser
};
