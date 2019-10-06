let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} it is a not valid role'
};

let userSchema = new Schema({
    name: { type: String, required: [true] },
    email: { type: String, unique: true, required: [true] },
    password: { type: String, required: [true] },
    img: { type: String, required: [false] },
    role: { type: String, required: [true], default: 'USER_ROLE', enum: validRoles },
    google: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('user', userSchema);