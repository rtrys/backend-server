const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hospitalSchema = new Schema({
	name: {
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
	}
});

module.exports = mongoose.model('Hospital', hospitalSchema);
