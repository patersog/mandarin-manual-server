
const router = require('express').Router();

const authRouter = require('./auth');
const usersRouter = require('./users');
const questionsRouter = require('./questions');

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/questions', questionsRouter);

module.exports = router;