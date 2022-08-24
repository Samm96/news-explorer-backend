const { AUTHORIZATION_ERROR_CODE } = require('../utils/errors');

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = AUTHORIZATION_ERROR_CODE;
  }
}

module.exports = AuthorizationError;
