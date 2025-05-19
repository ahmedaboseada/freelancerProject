const AsyncHandler = require('express-async-handler');
const {fetchAnotherServer} = require('../../utils/fetchAnotherServer');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const RegistrationController = AsyncHandler(async (req, res, next) => {
    if (req.session.refreshToken) {
        return next(new ApiError("You are already logged in", responseTypes.BAD_REQUEST.code));
    }
    const {name, email, password, confirmPassword, phone, profile, role} = req.body;

    if (!name || !email || !password || !confirmPassword || !phone || !profile || !role) {
        return responseWrapper(res, responseTypes.BAD_REQUEST, "All fields are required");
    }

    const data = {name, email, password, confirmPassword, phone, profile, role};

    try {
        const response = await fetchAnotherServer(`${process.env.AUTH_SERVER}/api/auth/signup`, 'POST', data);
        if (response.statusCode === 201) {
            req.session.refreshToken = response.data.REFRESH_TOKEN;
            return responseWrapper(res, responseTypes.CREATED, "User registered successfully", response.data.REFRESH_TOKEN);
        } else {
            return next(new ApiError(response.message || "Something went wrong", response.statusCode || responseTypes.BAD_REQUEST.code));
        }
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
});

module.exports = RegistrationController;
