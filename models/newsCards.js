const mongoose = require('mongoose');

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
    },

    image: {
      type: String,
      required: true,
    },

    owner: {
      type: String,
      required: true,
      select: false,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('newsCard', newsCardScheme);
