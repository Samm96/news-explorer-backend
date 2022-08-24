const router = require('express').Router();

const articlesRouter = require('./newsCards');
const usersRouter = require('./users');

router.use('/saved-news', articlesRouter);
router.use('/users', usersRouter);

module.exports = router;
