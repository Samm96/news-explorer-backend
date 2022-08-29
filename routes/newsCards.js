const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkRegex } = require('../utils/regex');
const validateURL = require('../utils/urlValidate');
const { requestLogger } = require('../middleware/loggers');

const {
  getSavedArticles,
  saveArticle,
  deleteArticle,
} = require('../controllers/newsCards');

router.get('/', getSavedArticles);

router.post(
  '/',
  requestLogger,
  celebrate({
    body: Joi.object().keys({
      ObjectId: Joi.string().hex().length(24),
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      publishedAt: Joi.string().required(),
      source: Joi.object().required(),
      urlToImage: Joi.string().regex(linkRegex).custom(validateURL),
      owner: Joi.string().hex().length(24),
    }),
  }),
  saveArticle,
);

router.delete(
  '/:articleId',
  celebrate({
    body: Joi.object().keys({
      ObjectId: Joi.string().hex().length(24),
    }),
  }),
  deleteArticle,
);

module.exports = router;
