const responseWrapper = require('../utils/responseWrapper');
const responseTypes = require('../utils/responseTypes');
const ApiError = require('../utils/apiError');

const logout = async (req, res, next) => {
    try {
        
        if (!req.session || !req.session.refreshToken) {
            return responseWrapper(res, responseTypes.SUCCESS, "User already logged out");
        }

        req.session.destroy((err) => {
            if (err) {
                return next(new ApiError("Failed to logout", responseTypes.SERVER_ERROR.code));
            }

            res.clearCookie('connect.sid'); 
            return responseWrapper(res, responseTypes.SUCCESS, "User logged out successfully");
        });
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = logout;
