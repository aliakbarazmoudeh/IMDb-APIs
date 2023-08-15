const customError = require('../errors');
const { verifyToken } = require('../utils/jwt');
const authenticateUser = async (req, res, next) => {
  try {
    const payload = verifyToken(req.signedCookies.token);
    if (payload) {
      req.user = payload;
      next();
    }
  } catch (error) {
    throw new customError.UnauthenticatedError('invalid authentication');
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new customError.UnauthorizedError(
        `you don't have access to this route`
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermission };
