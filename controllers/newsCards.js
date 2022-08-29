const NewsCard = require('../models/newsCards');
const { SUCCESS_MSG } = require('../utils/utils');
const InternalServerError = require('../errors/InternalError');
const AuthorizationError = require('../errors/AuthorizationError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

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
        .then(() => res
          .status(SUCCESS_MSG)
          .send({ message: 'Article deleted successfully' }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getSavedArticles,
  saveArticle,
  deleteArticle,
};
