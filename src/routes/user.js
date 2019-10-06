const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { verifyUserToken, verifyAdminUserRole, verifyAdminRolOnMyOwnUser } = require('../middlewares/auth');

const app = express();


// =======================================
// GET all users
// =======================================
app.get('/', (req, res) => {

    const from = Number(req.query.from || 0);

    User.find({}, 'name email img role google')
        .skip(from)
        .limit(5)
        .exec((err, usersDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error getting users',
                    errs: err
                });
            }

            User.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    payload: {
                        total: count,
                        users: usersDB
                    }
                });
            });
        });
});

// =======================================
// PUT Update user
// =======================================
app.put('/:id', [verifyUserToken, verifyAdminRolOnMyOwnUser], (req, res) => {

    const id = req.params.id;
    const body = req.body;

    User.findById(id, (err, foundUser) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding user',
                errs: err
            });
        }

        if (!foundUser) {
            return res.status(400).json({
                ok: false,
                message: `User with id ${id} do not exist`,
                errs: { message: `User with id ${id} do not exist` }
            });
        }

        foundUser.name = body.name;
        foundUser.email = body.email;
        foundUser.role = body.role;

        foundUser.save((err, updatedUser) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating user',
                    errs: err
                });
            }

            updatedUser.password = '*******';

            res.status(200).json({
                ok: true,
                payload: updatedUser
            });

        });

    });

});

// =======================================
// Create a new user
// =======================================
app.post('/', (req, res) => {

    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        pass: bcrypt.hashSync(body.pass, 10),
        img: body.img,
        role: body.role
    });

    user.save((err, savedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creating user',
                errs: err
            });
        }

        savedUser.password = '*****';

        res.status(201).json({
            ok: true,
            payload: savedUser
        });
    });

});

// =======================================
// Delete user
// =======================================
app.delete('/:id', [verifyUserToken, verifyAdminUserRole], (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove(id, (err, deletedUser) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error deleting user',
                errs: err
            });
        }

        res.status(200).json({
            ok: true,
            payload: deletedUser
        });
    });
});

module.exports = app;