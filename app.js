require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/news-explorer');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log('Listening at PORT 3000');
});
