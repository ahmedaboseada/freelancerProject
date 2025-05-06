const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');
const AsyncHandler = require('express-async-handler');

const logout = AsyncHandler(async (req, res, next) => {
    try {
        if (!req.session.refreshToken) {
            return next(new ApiError("You are not logged in", responseTypes.UNAUTHORIZED.code));
        }
        req.session.destroy((err) => {
            if (err) {
                return next(new ApiError("Failed to log out", responseTypes.SERVER_ERROR.code));
            }
            res.clearCookie('connect.sid');
            responseWrapper(res, responseTypes.SUCCESS, "User logged out successfully");
        });
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
});

module.exports = logout;
