const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { checkMail } = require('../utils/CheckMail');
const responseWrapper = require('../utils/responseWrapper');
const responseTypes = require('../utils/responseTypes');
const ApiError = require('../utils/apiError');

const register = async (req, res, next) => {
    try {
        const { name, email, password,confirmPassword, phone, profile, role } = req.body;

        if (!name || !email || !password || !confirmPassword || !phone || !profile || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const findEmail = await User.findOne({ 'email.emailAddress': email });
        if (findEmail) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        const findPhone = await User.findOne({ 'phone.phoneNumber': phone });
        if (findPhone) {
            return res.status(400).json({ message: "Phone number is already in use" });
        }

        const isEmailValid = await checkMail(email);
        if (isEmailValid === 'UNDELIVERABLE') {
            return res.status(400).json({ message: "Invalid email address" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email: { emailAddress: email, isVerified: false },
            password: hashedPassword,
            phone: { phoneNumber: phone, isVerified: false },
            profilePicture: "https://i.imgur.com/6VBx3io.png",
            role,
            profile,
        });
        const savedUser = await newUser.save();

        const generateTokens = (userId, role) => {
            const ACCESS_TOKEN = jwt.sign({ userId, role }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const REFRESH_TOKEN = jwt.sign({ userId, role }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
            return { ACCESS_TOKEN, REFRESH_TOKEN };
        };

        const { ACCESS_TOKEN, REFRESH_TOKEN } = generateTokens(savedUser._id, savedUser.role);

        responseWrapper(res,responseTypes.CREATED,"User registered successfully", {ACCESS_TOKEN, REFRESH_TOKEN});

    } catch (error) {
        const statusCode = error.code || responseTypes.SERVER_ERROR.code;
        const message = statusCode === 400 ? error.message : responseTypes.SERVER_ERROR.message;
        return next(new ApiError(message, statusCode));
    }
};

module.exports = register;
