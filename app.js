require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/news-explorer');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// do i need the `Access-Control-Allow-Origin` for the NewsApi?
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Origin', 'https://newsapi.org/v2');
  res.header('Access-Control-Request-Methods', 'GET,HEAD,POST,DELETE');
  res.header(
    'Access-Content-Control-Request-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use(routes);
app.use(errors());

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log('Listening at PORT 3000');
});
