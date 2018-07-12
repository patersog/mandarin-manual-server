
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
			return user.validatePassword(password);
		})
		.then(isValid => {
			if (!isValid) {
				return Promise.reject({
					reason: 'LoginError',
					message: 'Incorrect password',
					location: 'password'
				});
			}
			/** Send back only user name and question.id...
			 * TODO:
			 * Move this code to its own file?
			 *
			 * We are generating the jwt from the username, firstname, lastname and the User mongoDB ObjectId()
			 *
			 */
			const {username, firstname, lastname, id} = user;
			const userInfo = {
				username,
				firstname,
				lastname,
			};

			console.log(userInfo);

			return done(null, userInfo);
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
