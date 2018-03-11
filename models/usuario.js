var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'Nombre requerido'] },
    email: { type: String, unique: true, required: [true, 'Email requerido'] },
    password: { type: String, required: [true, 'Password requerido'] },
    img: { type: String, required: [false] },
    role: { type: String, required: [true], default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('usuario', usuarioSchema);