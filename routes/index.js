const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');
const { emailRegex } = require('../utils/regex');

const NotFoundError = require('../errors/NotFoundError');

const articlesRouter = require('./newsCards');
const usersRouter = require('./users');

const { createUser, userLogin } = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    username: Joi.string().min(2).max(10).required(),
    email: Joi.string().email(emailRegex).required(),
    password: Joi.string().required(),
  }),
}), createUser);
router.post('/signin', userLogin);

router.use(auth);

router.use('/articles', articlesRouter);
router.use('/users', usersRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
