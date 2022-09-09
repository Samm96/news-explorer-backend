const mongoose = require('mongoose');
const { linkRegex } = require('../utils/regex');

const newsCardSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
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

module.exports = mongoose.model('newsCard', newsCardSchema);
