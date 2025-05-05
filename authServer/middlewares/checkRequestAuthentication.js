const asyncHandler = require('express-async-handler');

const checkRequestAuthentication = asyncHandler(async (req, res, next) => {
    const {authuser: authUser, authpass: authPass} = req.headers;
    const internalSecret = req.headers['x-internal-secret'];
    if (authUser === process.env.AUTH_USER && authPass === process.env.AUTH_PASS) {
        return next()
    } else if (internalSecret === process.env.INTERNAL_SECRET) {
        return next();
    } else {
        return res.status(401).json({
            message: 'Unauthorized',
            error: 'Invalid credentials'
        });
    }
})

module.exports = checkRequestAuthentication