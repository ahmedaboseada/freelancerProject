const mongoose = require("mongoose");

const {Schema} = mongoose;

const proposalSchema = new Schema({
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coverLetter: {
            type: String,
            optional: true,
            minLength: [50, "Cover letter must be at least 50 characters long"],
            maxLength: [5000, "Cover letter must be at most 1000 characters long"],
        },
        bidAmount: {
            type: Number,
            required: true,
            min: [1, "Bid amount must be a positive number"],
        },
        timeLineEstimate: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
        }
    },
    {
        timestamps: true,
    })

const Proposal = mongoose.model("Proposal", proposalSchema);

module.exports = Proposal;