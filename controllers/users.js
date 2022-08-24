const User = require('../models/users');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');

const getUser = (req, res, next) => {
  const id = req.params.id !== 'me' ? req.params.id : req.user._id;

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

module.exports = {
  getUser,
  getCurrentUser,
};
