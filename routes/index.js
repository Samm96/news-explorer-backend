const router = require('express').Router();

const articlesRouter = require('./newsCards');
const usersRouter = require('./users');

const { createUser, userLogin } = require('../controllers/users');

router.use('/saved-news', articlesRouter);
router.use('/users', usersRouter);

router.post('/signup', createUser);
router.post('/signin', userLogin);

module.exports = router;
