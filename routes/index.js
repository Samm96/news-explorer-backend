const router = require('express').Router();
const auth = require('../middleware/auth');

const NotFoundError = require('../errors/NotFoundError');

const articlesRouter = require('./newsCards');
const usersRouter = require('./users');

const { createUser, userLogin } = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', userLogin);

router.use(auth);

router.use('/articles', articlesRouter);
router.use('/users', usersRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
