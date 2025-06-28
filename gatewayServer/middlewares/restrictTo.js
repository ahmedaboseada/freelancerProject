const ApiError = require('../utils/apiError');

const restrictTo =
  (...allowedRoles) =>
  async (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError('Unauthorized: Insufficient permissions', 403));
    }
    next();
  };

module.exports = { restrictTo };
