const mongoose = require('mongoose');
const { emailRegex } = require('../utils/regex');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: 'Elise',
      minLength: [2, 'The NAME field length is too short'],
      maxLength: [15, 'The NAME field length is too long'],
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

module.exports = mongoose.model('user', userSchema);
