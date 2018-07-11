
const express = require('express');

const Questions = require('../models/questions');

const router = express.Router();

router.get('/', (req, res, next) => {
	Questions.find()
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			next(err);
		});
});


router.get('/:id', (req, res, next) => {
	const {id} = req.params;
	Questions.findById(id)
		.then(result => {
			console.log('TAG 02',result);
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
});

module.exports = router;

