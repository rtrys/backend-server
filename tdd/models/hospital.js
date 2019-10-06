let mongoose = require('mongoose');
let Schema = mongoose.Schema();

let hospitalSchema = new Schema({
    name: { type: String, required: [true] },
    img: { type: String, required: false },
    _user: { type: Schema.Types.ObjectId, ref: 'usuario', required: true }
});

module.exports = mongoose.model('hospital', hospitalSchema);