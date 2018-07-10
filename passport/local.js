
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user');

const localStrategy = new LocalStrategy((username, password, done) => {
	let user;

	User.findOne({ username })
		.then(results => {
			user = results;
			if (!user) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect username',
					location: 'username'
				});
			}
			console.log('made it here!');
			return user.validatePassword(password);
		})
		.then(isValid => {
			console.log('TAG 4', isValid);
			if (!isValid) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect password',
					location: 'password'
				});
			}
			return done(null, user);
		})
		.catch(err => {
			if (err.reason === 'LoginError') {
				err.status = 401;
				return done(err);
			}
			return done(err);
		});
});

module.exports = localStrategy;
