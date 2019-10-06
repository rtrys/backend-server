let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let doctorSchema = new Schema({
    name: { type: String, required: [true] },
    img: { type: String, required: false },
    _user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    _hospital: { type: Schema.Types.ObjectId, ref: 'hospital', required: [true] }
});

module.exports = mongoose.model('doctor', doctorSchema);