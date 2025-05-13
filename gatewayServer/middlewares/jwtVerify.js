const jwt = require('jsonwebtoken');
const responseWrapper = require('../utils/responseWrapper');
const responseTypes = require('../utils/responseTypes');
const ApiError = require('../utils/apiError');
const log = require("eslint-plugin-react/lib/util/log");

const jwtVerify = (req, res, next) => {
    const token = req.session.refreshToken;
    if (!token) {
        return next(new ApiError("You have to login first!", responseTypes.UNAUTHORIZED.code));
    }
    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return next(new ApiError("Failed to authenticate token", responseTypes.UNAUTHORIZED.code));
        }
        req.user = decoded;
        next();
    });
}

module.exports = jwtVerify;