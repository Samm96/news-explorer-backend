const mongoose = require('mongoose');
const { linkRegex } = require('../utils/regex');

const newsCardScheme = new mongoose.Schema(
  {
    keyword: {
      type: String,
    },

    title: {
      type: String,
    },

    text: {
      type: String,
    },

    date: {
      type: String,
    },

    source: {
      type: String,
    },

    link: {
      type: String,
      required: true,
      validate: {
        validator: (v) => linkRegex.test(v),
        message: 'This is not a valid URL',
      },
    },

    image: {
      type: String,
      required: true,
      validate: {
        validator: (v) => linkRegex.test(v),
        message: 'This is not a valid URL',
      },
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('newsCard', newsCardScheme);
