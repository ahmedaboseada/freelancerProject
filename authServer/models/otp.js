const mongoose = require('mongoose');

const {Schema} = mongoose;

const otpSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        optional: true
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1m', // OTP expires after 1 minute
    },
})

const otpModel = mongoose.model('Otp', otpSchema);

module.exports = otpModel;