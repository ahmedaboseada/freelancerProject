const AsyncHandler = require('express-async-handler');
const { fetchAnotherServer } = require('../../utils/fetchAnotherServer');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const RegistrationController = AsyncHandler(async (req, res, next) => {
    const { name, email, password, phone, profile, role } = req.body;

    if (!name || !email || !password || !phone || !profile || !role) {
        return responseWrapper(res, responseTypes.BAD_REQUEST, "All fields are required");
    }

    const data = { name, email, password, phone, profile, role };

    try {
        const response = await fetchAnotherServer(`${process.env.AUTH_SERVER}/api/auth/signup`, 'POST', data);

        if (response.statusCode === 201) {
            req.session.refreshToken = response.data.REFRESH_TOKEN;
            return responseWrapper(res, responseTypes.CREATED, "User registered successfully", response.data);
        } else {
            return responseWrapper(res, response.statusCode || responseTypes.BAD_REQUEST.code, response.message || "Something went wrong");
        }
    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
});

module.exports = RegistrationController;
