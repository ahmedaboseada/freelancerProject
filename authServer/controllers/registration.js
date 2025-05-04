const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { checkMail } = require('../utils/CheckMail');

const register = async (req, res) => {
    try {
        const { name, email, password, phone, profile, role } = req.body;

        if (!name || !email || !password || !phone || !profile || !role) {
            return res.status(400).json({ message: "All fields are required" });
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

        console.log("ACCESS_TOKEN:", ACCESS_TOKEN);
        console.log("REFRESH_TOKEN:", REFRESH_TOKEN);

        res.status(201).json({
            message: "User registered successfully",
            ACCESS_TOKEN,
            REFRESH_TOKEN,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = register;
