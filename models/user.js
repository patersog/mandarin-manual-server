'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstname: { type: String, default: ''},
  lastname: { type: String, default: '' },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  questions: { type: Object },

});

UserSchema.set('toObject', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret._v;
    delete ret.password;
  }
});

UserSchema.methods.validataPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statistics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
