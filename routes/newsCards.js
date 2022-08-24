const router = require('express').Router();
const { linkRegex } = require('../utils/regex');
const validateURL = require('../utils/urlValidate');

const {
  getSavedArticles,
  saveArticle,
  deleteArticle,
} = require('../controllers/newsCards');

router.get('/saved-news', getSavedArticles);

router.post('/saved-news', saveArticle);

router.delete('/saved-news/:articleId', deleteArticle);

module.exports = router;
