const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
	nombre: {
		type: String,
		required: [ true ]
	},
	img: {
		type: String,
		required: false
	},
	usuario: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	hospital: {
		type: Schema.Types.ObjectId,
		ref: 'Hospital',
		required: [ true ]
	}
});

module.exports = mongoose.model('Doctor', doctorSchema);
