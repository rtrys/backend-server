const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyUserToken } = require('../middlewares/auth');

// google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();
const User = require('../models/user');


// =========================================
// google auth
// =========================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
        // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => {

    const token = req.body.token;

    const userGoogle = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                message: "Invalid token",
                errs: err
            });
        });

    User.findOne({
        email: userGoogle.email
    }, (err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error finding user",
                errs: err
            });
        }

        if (user) {
            if (!user.google) {
                return res.status(400).json({
                    ok: false,
                    message: "Usar autnticacion normal",
                    errs: { message: "Usuario creado con email y password, no con google" }
                });
            } else {

                let jwtToken = createToken(user);

                return res.status(200).json({
                    ok: true,
                    user: user,
                    token: jwtToken,
                    id: user._id,
                    menu: getMenu(user.role)
                });
            }

        } else {
            // No se ha encontrado ningun usuario con ese email

            const newUser = new User({
                name: userGoogle.name,
                email: userGoogle.email,
                password: "*****",
                img: userGoogle.picture,
                google: true
            });

            newUser.save((err, savedUser) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: "Error al crear usuario",
                        errs: err
                    });
                }

                let jwtToken = createToken(savedUser);

                return res.status(200).json({
                    ok: true,
                    user: savedUser,
                    token: jwtToken,
                    id: savedUser._id,
                    menu: getMenu(savedUser.role)
                });

            });

        }

    });
});

// =========================================
// autenticacion normal
// =========================================
app.post('/', (req, res) => {

    const body = req.body;

    User.findOne({ email: body.email }, (err, foundUser) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error buscando usuarios",
                errs: err
            });
        }

        if (!foundUser) {
            return res.status(400).json({
                ok: false,
                message: "Credenciales incorrectas - email",
                errs: err
            });
        }

        if (!bcrypt.compareSync(body.password, foundUser.password)) {
            return res.status(400).json({
                ok: false,
                message: "Credenciales incorrectas - password",
                errs: err
            });
        }

        let jwtToken = createToken(foundUser);

        res.status(200).json({
            ok: true,
            user: foundUser,
            token: jwtToken,
            id: foundUser._id,
            menu: getMenu(foundUser.role)
        });
    });


});

// =========================================
// autenticacion normal
// =========================================
app.post('/renuevatoken', [verifyUserToken], (req, res) => {

    const token = createToken(req.usuario);

    return res.status(200).json({
        ok: true,
        token: token
    });
});

function createToken(usuario) {

    // me aseguro que no sea expuesta la clave
    usuario.password = "*****";

    // el token debe expirar en 4 horas 
    return jwt.sign({ user: usuario },
        process.env.JWT_SEED, { expiresIn: 14400 }
    );

}

function getMenu(ROLE) {

    let menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'Progress Bar', url: '/progress' },
                { titulo: 'Graficas', url: '/graficas1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'RXJS', url: '/rxjs' },
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // { titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Hospitales', url: '/hospitales' },
                { titulo: 'Medicos', url: '/medicos' },
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }

    return menu;
}

module.exports = app;