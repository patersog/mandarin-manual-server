
const express = require('express');

const Questions = require('../models/questions');
const Users = require('../models/user');

const router = express.Router();

// router.get('/', (req, res, next) => {
// 	Questions.find()
// 		.then(results => {
// 			res.json(results);
// 		})
// 		.catch(err => {
// 			next(err);
// 		});
// });


router.get('/:id', (req, res, next) => {
	const {id} = req.params;
	Questions.findById(id)
		.then(result => {
			console.log('INSIDE /api/questions/:id', result);
			console.log('Prompt: ', result.prompt);
			res.json(result.prompt);
		})
		.catch(err => {
			next(err);
		});
});

module.exports = router;

