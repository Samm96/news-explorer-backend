const { CAST_ERROR_CODE } = require('../utils/errors');

class CastError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CAST_ERROR_CODE;
  }
}

module.exports = CastError;
