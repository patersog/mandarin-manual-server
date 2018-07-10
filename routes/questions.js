
const express = require('express');

const Questions = require('../models/questions');

const router = express.Router();

router.get('/', (req, res, next) => {
	Questions.find()
		.then(results => {
			return res.json(results);
		})
		.catch(err => {
			next(err);
		});
});

module.exports = router;

