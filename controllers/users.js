const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { secretDevKey } = require('../utils/configuration');

const User = require('../models/users');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { SUCCESS_MSG } = require('../utils/constants');

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
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Email already in use');
      } else {
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      const userInfo = user.toJSON();
      delete userInfo.password;
      res.status(SUCCESS_MSG).send({ data: userInfo });
    })
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

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : secretDevKey,
        {
          expiresIn: '7d',
        },
      );

      res.send({ data: user.toJSON(), token });
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
