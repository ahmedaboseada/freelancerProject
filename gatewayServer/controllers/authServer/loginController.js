const {fetchAnotherServer} = require('../../utils/fetchAnotherServer');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const loginController = async (req, res, next) => {
    console.log("Session ID:", req.sessionID);
    console.log("Stored refreshToken:", req.session.refreshToken);
    console.log(req.session.refreshToken)
    if (req.session.refreshToken) {
        return next(new ApiError("You are already logged in", responseTypes.BAD_REQUEST.code));
    }

    const {identifier, password} = req.body;

    if (!identifier || !password) {
        return responseWrapper(res, responseTypes.BAD_REQUEST, "All fields are required");
    }

    const data = {identifier, password};

    try {
        const response = await fetchAnotherServer(`${process.env.AUTH_SERVER}/api/auth/login`, 'POST', data);
        if (response.statusCode === 200) {
            const refreshToken = response.data.refreshToken;
            req.session.refreshToken = refreshToken;
            console.log("Stored refreshToken in session:", req.session.refreshToken);
            // responseWrapper(res, responseTypes.SUCCESS, "Logged in successfully", {REFRESH_TOKEN:response.data.REFRESH_TOKEN});
            responseWrapper(res, responseTypes.SUCCESS, "Logged in successfully", {
                refreshToken: refreshToken
            });
        } else {
            return next(new ApiError(response.message || "Something went wrong", response.statusCode || responseTypes.BAD_REQUEST.code));
        }
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 401 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = loginController;
