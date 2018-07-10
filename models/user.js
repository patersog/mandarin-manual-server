
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
	_this: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	},
	next: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Question'
	},
	m : {
		type: Number,
		default: 1
	}
});

const UserSchema = new mongoose.Schema({
	firstname: {
		type: String,
		default: ''
	},
	lastname: {
		type: String,
		default: ''
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	questions: {
		current: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Question',
			default: null
		},
		list: {
			type: [nodeSchema]
		}
	}
});

/**
 *  [ C , D , B,  A ]
 *
 *  [ B -> C -> D -> A ]
 *
 */

UserSchema.set('toObject', {
	transform: function(doc, ret) {
		ret.id = ret._id;
		delete ret._id;
		delete ret.__v;
		delete ret.password;
	}
});

UserSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
