var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAuth = require('../middlewares/autenticacion');

// google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

var app = express();
var Usuario = require('../models/usuario');


// =========================================
// autenticacion con google
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
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}

app.post('/google', async(req, res) => {

    var token = req.body.token;

    var userGoogle = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                message: "Token no valido",
                errs: err
            });
        });

    Usuario.findOne({
        email: userGoogle.email
    }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al buscar usuario",
                errs: err
            });
        }

        if (usuario) {
            if (!usuario.google) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Usar autnticacion normal",
                    errs: { message: "Usuario creado con email y password, no con google" }
                });
            } else {

                let jwtToken = createToken(usuario);

                return res.status(200).json({
                    ok: true,
                    usuario: usuario,
                    token: jwtToken,
                    id: usuario._id,
                    menu: obtenerMenu(usuario.role)
                });
            }

        } else {
            // No se ha encontrado ningun usuario con ese email

            var usuarioNuevo = new Usuario({
                nombre: userGoogle.name,
                email: userGoogle.email,
                password: "*****",
                img: userGoogle.picture,
                google: true
            });

            usuarioNuevo.save((err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: "Error al crear usuario",
                        errs: err
                    });
                }

                let jwtToken = createToken(usuario);

                return res.status(200).json({
                    ok: true,
                    usuario: usuario,
                    token: jwtToken,
                    id: usuario._id,
                    menu: obtenerMenu(usuario.role)
                });

            });

        }

    });
});

// =========================================
// autenticacion normal
// =========================================
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: "Error buscando usuarios",
                errs: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: "Credenciales incorrectas - email",
                errs: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                message: "Credenciales incorrectas - password",
                errs: err
            });
        }

        let jwtToken = createToken(usuarioDB);

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: jwtToken,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });
    });


});

// =========================================
// autenticacion normal
// =========================================
app.post('/renuevatoken', [mdAuth.verificaToken], (req, res) => {

    var token = createToken(req.usuario);

    return res.status(200).json({
        ok: true,
        token: token
    });
});

function createToken(usuario) {

    // me aseguro que no sea expuesta la clave
    usuario.password = "*****";

    // el token debe expirar en 4 horas 
    return token = jwt.sign({ usuario: usuario },
        process.env.JWT_SEED, { expiresIn: 14400 }
    );

}

function obtenerMenu(ROLE) {

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