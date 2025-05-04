const asyncHandler = require('express-async-handler');

const checkRequestAuthentication = asyncHandler(async (req, res, next) => {
    const {authuser: authUser, authpass: authPass} = req.headers;
    if (authUser === process.env.AUTH_USER && authPass === process.env.AUTH_PASS) {
        return next()
    } else if (`${req.protocol}://${req.get('host')}` === process.env.ENDPOINT_AUTH) {
        return next()
    } else {
        return res.status(401).json({
            message: 'Unauthorized',
            error: 'Invalid credentials'
        });
    }
})

module.exports = checkRequestAuthentication