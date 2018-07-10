
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRY } = require ('../config');

const router = express.Router();

function createAuthToken(user) {
	return jwt.sign({ user }, JWT_SECRET, {
		subject: user.username,
		expiresIn: JWT_EXPIRY
	});
}

const options = {session: false, failWithError: true};

const localAuth = passport.authenticate('local', options);

router.post('/login', localAuth, (req, res) => {
	console.log('TAG 100','please?');
	const authToken = createAuthToken(req.user);
	res.json({ authToken });
});

const jwtAuth = passport.authenticate('jwt', options);

router.post('/refresh', jwtAuth, (req, res) => {
	const authToken = createAuthToken(req.user);
	res.json({ authToken });
});



module.exports = router;
