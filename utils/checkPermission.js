const customError = require('../errors');
const checkPermission = (localUser, foreignUserId) => {
  if (localUser.role === 'admin') return;
  if (localUser.userID === foreignUserId) return;
  throw new customError.UnauthorizedError(
    'you dont have access, invalid credentials'
  );
};

module.exports = checkPermission;
