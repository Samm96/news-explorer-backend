const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const User = require('../models/users');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { SUCCESS_MSG } = require('../utils/utils');

const getUser = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found'));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('User ID not valid'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('User ID not found'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  getUser(req, res, next);
};

const createUser = (req, res, next) => {
  const { username, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Email already in use');
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => User.create({ username, email, password: hash }))
    .then((user) => res.status(SUCCESS_MSG).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Missing or invalid email or password'));
      } else {
        next(err);
      }
    });
};

const userLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email/password or user doesn\'t exist'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Incorrect email or password'));
        }
        return user;
      });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      const userInfo = user.toJSON();
      delete userInfo[password];

      res.send({ data: userInfo, token });
    })
    .catch(() => {
      next(new BadRequestError('Incorrect email or password'));
    });
};

module.exports = {
  getUser,
  getCurrentUser,
  createUser,
  userLogin,
};
