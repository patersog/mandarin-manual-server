
const mongoose = require('mongoose');

const DATABASE_URL = 'mongodb://dev:dev123@ds231961.mlab.com:31961/sr-app-db';

const Question = require('../models/questions');
const seedQuestions = require('../db/seed/questions');

mongoose.connect(DATABASE_URL)
  .then(() => {
    return mongoose.connection.db.dropDatabase();
  })
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