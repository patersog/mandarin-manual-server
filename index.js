

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');


const {PORT, CLIENT_ORIGIN} = require('./config');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const appRouter = require('./routes');

passport.use(localStrategy);
passport.use(jwtStrategy);

const {dbConnect} = require('./db-mongoose');

const app = express();

// Utilize the Express `.json()` body parser
app.use(express.json());

app.use(morgan(
	process.env.NODE_ENV === 'production'
		? 'common'
		: 'dev', {
		skip: (req, res) => process.env.NODE_ENV === 'test'
	}));

app.use(cors({origin: CLIENT_ORIGIN}));

app.use('/api', appRouter);

app.use(function (req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: app.get('env') === 'development' ? err : {}
	});
});


function runServer(port = PORT) {
	const server = app.listen(port, () => {
		console.info(`App listening on port ${server.address().port}`);
	}).on('error', err => {
		console.error('Express failed to start');
		console.error(err);
	});
}

if (require.main === module) {
	dbConnect();
	runServer();
}

module.exports = {
	app
};
