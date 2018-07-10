
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
	category: {
		type: String,
		required: true
	},
	prompt: {
		type: String,
		required: true
	},
	answer: {
		type: String,
		required: true
	},
});


QuestionSchema.set('toObject', {
	transform: function(doc, ret) {
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
	}
});

module.exports = mongoose.model('Question', QuestionSchema);
