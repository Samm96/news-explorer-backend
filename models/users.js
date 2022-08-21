const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minLength: [2, 'The EMAIL field length is too short'],
    maxLength: [30, 'The EMAIL field length is too long'],
    required: [true, 'Required field'],
  },

  password: {
    type: String,
    required: [true, 'Required field'],
  },

  name: {
    type: String,
    default: 'Elise',
    minLength: [2, 'The NAME field length is too short'],
    maxLength: [30, 'The NAME field length is too long'],
    required: [true, 'Required field'],
  },
});

module.exports = mongoose.model('user', userSchema);
