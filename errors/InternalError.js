const { INT_SERVER_ERROR_CODE } = require('../utils/errors');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INT_SERVER_ERROR_CODE;
  }
}

module.exports = InternalServerError;
