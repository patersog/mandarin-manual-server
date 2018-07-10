
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
	category: {type: String, required: true},
	prompt: {type: String, required: true},
	answer: {type: String, required: true},
	_m : {type: Number, required: true},
	_next:{type: mongoose.Types.ObjectId}
});


QuestionSchema.set('toObject', {
	transform: function(doc, ret) {
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
	}
});

module.exports = mongoose.model('Question', QuestionSchema);
