
const express = require('express');

const Users = require('../models/user');
const Questions = require('../models/questions');

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


/** A -> B -> C -> D */

//  1    1    1    1

//  B -> A -> C -> D

//  1    2    1    1

//  A -> C -> B -> D

//  2    1    2    1

//  C -> B -> D -> A

//  1    2    1    4


router.get('/:username', (req, res, next) => {
	const {username} = req.params;
	Users.findOne({'username': username})
		.select('questions.head')
		.then(result => {
			const { head } = result.questions;
			return Questions.findById({_id: head})
				.select('prompt');
		})
		.then(prompt => {
			console.log('PROMPT', prompt);
			res.json(prompt);
		})
		.catch(err => {
			next(err);
		});
});


router.get('/correct/:username', (req, res, next) => {
	const {username} = req.params;
	const {answer} = req.body;
	Users.findOne({'username': username})
		.select('questions.head')
		.then(result => {
			const {head } = result.quesionts;
			return Questions.findById({_id: head})
				.select('answer');
		})
		.then( question => {
			console.log(question);
			if(answer === answer) {
				res.json(true);
			} else {
				res.json(false);
			}
		})
		.catch(err => {
			next(err);
		});
});

module.exports = router;

