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
 *
 * You can apply this in `app.js` for the entire application (place it before all routes)
 * or you can pass middleware as the second argument inside the request handler:
 *     i.e. `app.post('/cards', auth, createCard)`
 * Some routes like signup or signin don't require auth.
 *
 * The way we wrote our middleware makes it so that upon successful authorization, an
object consisting of the payload will be saved to the user property of the request
object:
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
