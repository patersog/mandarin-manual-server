const mongoose = require('mongoose');

const {
	DATABASE_URL
} = require('../config');
const Question = require('../models/questions');
const seedQuestions = require('../db/seed/questions');

mongoose.connect(DATABASE_URL)
	.then(() => mongoose.connection.db.dropDatabase())
	.then(() => {
		return Promise.all([
			Question.insertMany(seedQuestions),
		]);
	})
	.then(() => mongoose.disconnect())
	.catch(err => {
		console.error(`ERROR: ${err.message}`);
		console.error(err);
	});