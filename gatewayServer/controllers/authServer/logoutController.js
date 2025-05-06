const AsyncHandler = require('express-async-handler');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');

const LogoutController = AsyncHandler(async (req, res, next) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return responseWrapper(res, responseTypes.SERVER_ERROR, "Logout failed");
            } else {
                return responseWrapper(res, responseTypes.SUCCESS, "User logged out successfully");
            }
        });
    } else {
        return responseWrapper(res, responseTypes.BAD_REQUEST, "No active session");
    }
});

module.exports = LogoutController;