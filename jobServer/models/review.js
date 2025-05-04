const mongoose = require("mongoose");

const {Schema} = mongoose;

const reviewShema = new Schema({
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reviewee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["client", "freelancer"],
            required: true,
        },
        rate: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            minLength: [5, "Comment is too short"],
            maxLength: [500, "Comment is too long"],
        }
    },
    {
        timestamps: true,
    })

const Review = mongoose.model("Review", reviewShema);

module.exports = Review;