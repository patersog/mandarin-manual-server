const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {
  DATABASE_URL
} = require('./config');

function dbConnect(url = DATABASE_URL) {
  return mongoose.connect(url)
    .then(result => {
      console.log('connected to database :' + result.connection.db.databaseName + ': @ ' + url);
    })
    .catch(err => {
      console.error('Mongoose failed to connect');
      console.error(err);
    });
}

function dbDisconnect() {
  return mongoose.disconnect();
}

function dbGet() {
  return mongoose;
}

module.exports = {
  dbConnect,
  dbDisconnect,
  dbGet
};