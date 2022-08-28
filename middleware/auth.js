const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const { JWT_SECRET } = process.env;

/** For this middleware, need to check if the request includes the user's token,
 * if it doesn't, add authorization error.
 *
 * If there is a token:
 * ** take the `Bearer` part of the token out
 * ** verify the token with the JWT secret when assigning it to the payload
 * ** else return Authorization error.
 */

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(AuthorizationError('Authorization Required'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(AuthorizationError('Authorization Required'));
  }

  req.user = payload;

  return next();
};
