const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const responseWrapper = require('../utils/responseWrapper');
const responseTypes = require('../utils/responseTypes');
const ApiError = require('../utils/apiError');

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ 'email.emailAddress': email });
        if (!user) {
            return res.status(401).json({ message: "Email not registered" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        
     
        
        const ACCESS_TOKEN = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const REFRESH_TOKEN = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

 

        responseWrapper(res,responseTypes.CREATED,"login successful", {ACCESS_TOKEN, REFRESH_TOKEN});

    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }

};

module.exports = login;
