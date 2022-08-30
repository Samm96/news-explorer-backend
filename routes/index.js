const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cors = require('cors');
const auth = require('../middleware/auth');
const { emailRegex } = require('../utils/regex');
const { requestLogger } = require('../middleware/loggers');

const NotFoundError = require('../errors/NotFoundError');

const articlesRouter = require('./newsCards');
const usersRouter = require('./users');

const { createUser, userLogin } = require('../controllers/users');

router.use(cors());

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(10).required(),
    email: Joi.string().email(emailRegex).required(),
    password: Joi.string().required(),
  }),
}), createUser);
router.post('/signin', requestLogger, userLogin);

router.use(cors());
router.options('*', cors());

router.use(auth);

router.use('/articles', articlesRouter);
router.use('/users', usersRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
