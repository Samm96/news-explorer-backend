const NewsCard = require('../models/newsCards');
const { SUCCESS_MSG } = require('../utils/constants');
const InternalServerError = require('../errors/InternalError');
const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const CastError = require('../errors/CastError');

const getSavedArticles = (req, res, next) => {
  const currentUserId = req.user._id;

  NewsCard.find({})
    .select('+owner')
    .then((articles) => {
      const userArticles = articles.filter(
        (article) => article.owner.toString() === currentUserId,
      );
      if (userArticles.length === 0) {
        next(new NotFoundError("You don't have any saved articles"));
      }

      return userArticles;
    })
    .then((articles) => {
      const articlesUpdated = [];

      if (articles.length > 1) {
        articles.forEach((article) => {
          const articleInfo = article.toJSON();
          delete articleInfo.owner;
          articlesUpdated.push(articleInfo);
        });
      } else if (articles.length === 1) {
        const article = articles[0];
        delete article.owner;
        articlesUpdated.push(article);
      }

      res.send(articlesUpdated);
    })
    .catch(() => {
      next(new InternalServerError('An error has occurred with the server'));
    });
};

const saveArticle = (req, res, next) => {
  console.log(req.user._id);

  const owner = req.user._id;

  const {
    keyword, title, text, date, link, source, image,
  } = req.body;

  NewsCard.create({
    keyword,
    title,
    text,
    date,
    link,
    source,
    image,
    owner,
  })
    .then((article) => {
      if (!owner) {
        next(
          new AuthorizationError(
            'You need to sign up or sign in to save articles',
          ),
        );
      }

      return article;
    })
    .then((article) => {
      const articleInfo = article.toJSON();
      delete articleInfo.owner;

      res.status(SUCCESS_MSG).send({ data: articleInfo });
    })
    .catch((err) => {
      if (err.status === 404) {
        next(new NotFoundError('Article not found'));
      } else {
        next(new InternalServerError('An error has occurred with the server'));
      }
    });
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  const currentUserId = req.user._id;

  NewsCard.findById(articleId)
    .select('owner')
    .orFail(new NotFoundError('Article ID not found'))
    .then((article) => {
      if (!articleId) {
        next(NotFoundError('Article ID not found'));
      }

      if (article.owner.toString() !== currentUserId) {
        next(new ForbiddenError("Cannot delete another user's card"));
      }
    })
    .then(() => {
      NewsCard.findOneAndDelete(articleId)
        .orFail(new NotFoundError('Article ID not found'))
        .then(() => {
          res.send({ message: 'Article deleted successfully' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Article ID not valid'));
      } else {
        next(new InternalServerError('An error has occurred with the server'));
      }
    });
};

module.exports = {
  getSavedArticles,
  saveArticle,
  deleteArticle,
};
