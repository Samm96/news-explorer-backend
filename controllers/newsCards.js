const NewsCard = require('../models/newsCards');
const { SUCCESS_MSG } = require('../utils/utils');
const InternalServerError = require('../errors/InternalError');
const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');

const getSavedArticles = (req, res, next) => {
  NewsCard.find({})
    .then((articles) => {
      res.send(articles);
    })
    .catch(() => {
      next(new InternalServerError('An error has occurred with the server'));
    });
};

const saveArticle = (req, res, next) => {
  // come back to this when auth is created
  console.log(req.user._id);

  const owner = req.user._id;

  const {
    keyword, title, description, publishedAt, source, urlToImage,
  } = req.body;

  NewsCard.create({
    keyword,
    title,
    description,
    publishedAt,
    source,
    urlToImage,
    owner,
  })
    .then((article) => res.send({ data: article }))
    .catch(() => {
      if (!owner) {
        console.log(owner);
        next(
          new AuthorizationError(
            'You need to sign up or sign in to save articles',
          ),
        );
      } else {
        next(new InternalServerError('An error has occurred with the server'));
      }
    });
};

const deleteArticle = (req, res, next) => {
  const articleId = req.params;

  NewsCard.findById(articleId)
    .orFail(new NotFoundError('Article ID not found'))
    .then((card) => {
      NewsCard.findOneAndDelete(articleId)
        .orFail(new NotFoundError('Article ID not found'))
        .then(() => res
          .status(SUCCESS_MSG)
          .send(card && { message: 'Article deleted successfully' }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getSavedArticles,
  saveArticle,
  deleteArticle,
};
