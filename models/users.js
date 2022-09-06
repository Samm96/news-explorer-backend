const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { emailRegex } = require('../utils/regex');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Elise',
      minLength: [2, 'The NAME field length is too short'],
      maxLength: [10, 'The NAME field length is too long'],
      required: [true, 'Required field'],
    },

    email: {
      type: String,
      minLength: [2, 'The EMAIL field length is too short'],
      maxLength: [30, 'The EMAIL field length is too long'],
      required: [true, 'Required field'],
      validate: {
        validator: (v) => emailRegex.test(v),
        message: 'This is not a valid email',
      },
    },

    password: {
      type: String,
      required: [true, 'Required field'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Incorrect email or password'));
        }

        return user;
      });
    });
};

userSchema.methods.toJSON = function () {
  const userInfo = this.toObject();
  delete userInfo.password;
  return userInfo;
};

module.exports = mongoose.model('user', userSchema);
