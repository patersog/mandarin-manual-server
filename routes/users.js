
const express = require('express');

const User = require('../models/user');
const Question = require('../models/questions');

const router = express.Router();

// GET USER
router.get('/', (req, res, next) => {
	User.findOne()
		.then(result => {
			const {username} = result;
			return res.json(username);
		})
		.catch(err => {
			next(err);
		});
});

// router.get('/:id', (req, res, next) => {
// 	const {id} = req.params;
// 	User.findById({_id: id})
// 		.then(result => {
// 			console.log(result);
// 		});
// });

// CREATE NEW USER
router.post('/', (req, res, next) => {

	const requiredFields = ['username', 'password'];
	const missingField = requiredFields.find(field => !(field in req.body));

	if (missingField) {
		const err = new Error(`Missing '${missingField}' in request body`);
		err.status = 422;
		return next(err);
	}

	const stringFields = ['username', 'password', 'firstname', 'lastname'];
	const nonStringField = stringFields.find(
		field => field in req.body && typeof req.body[field] !== 'string'
	);

	if (nonStringField) {
		const err = new Error(`Field: '${nonStringField}' must be type String`);
		err.status = 422;
		return next(err);
	}

	const explicityTrimmedFields = ['username', 'password'];
	const nonTrimmedField = explicityTrimmedFields.find(
		field => req.body[field].trim() !== req.body[field]
	);

	if (nonTrimmedField) {
		const err = new Error(`Field: '${nonTrimmedField}' cannot start or end with whitespace`);
		err.status = 422;
		return next(err);
	}

	const sizedFields = {
		username: { min: 1 },
		password: { min: 8, max: 72 }
	};

	const tooSmallField = Object.keys(sizedFields).find(
		field => 'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
	);

	if (tooSmallField) {
		const min = sizedFields[tooSmallField].min;
		const err = new Error(`Field: '${tooSmallField}' must be at least ${min} characters long`);
		err.status = 422;
		return next(err);
	}

	const tooLargeField = Object.keys(sizedFields).find(
		field => 'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
	);

	if (tooLargeField) {
		const max = sizedFields[tooLargeField].max;
		const err = new Error(`Field: '${tooLargeField}' must be at most ${max} characters long`);
		err.status = 422;
		return next(err);
	}

	let { username, password, firstname = '', lastname = '' } = req.body;
	firstname = firstname.trim();
	lastname = lastname.trim();

	let user_id;

	return User.hashPassword(password)
		.then(digest => {
			const newUser = {
				username,
				password: digest,
				firstname,
				lastname
			};
			return User.create(newUser);
		})
		.then(user => {
			user_id = user.id;
			/**
			 * TODO:
			 * Find a grouping of questions based on some criteria...?
			 */
			return Question.find();
		})
		.then(q_collection => {
			return q_collection.map((q, index) => ({
				qid: q._id,
				next: index,
				m: 1
			}));
		})
		.then(nodelist => {
			return User
				.findByIdAndUpdate({_id: user_id},
					{ 'questions.head' : nodelist[0].qid, 'questions.list': nodelist},
					{ new: true, select: 'username'}
				);
		})
		.then(result => {
			return res.status(201).location(`/api/users/${result.id}`).json(result);
		})
		.catch(err => {
			if (err.code === 11000) {
				err = new Error('The username already exists');
				err.status = 400;
			}
			next(err);
		});
});


module.exports = router;
