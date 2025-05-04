const mongoose = require("mongoose");

const {Schema} = mongoose;

const dispute = new Schema({
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        milestone: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Milestone",
            optional: true
        },
        raisedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        raisedAgainst: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["freelancer", "client"],
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        details: {
            type: String,
            required: true,
            minLength: [50, "Details must be at least 50 characters long"],
            maxLength: [2000, "Details must be at most 2000 characters long"],
        },
        attachments: {
            type: [String],
            optional: true,
            maxLength: [3, "Attachments must be at most 3 files"],
        },
        status: {
            type: String,
            enum: ["open", "in-review", "resolved", "closed"],
            default: "open",
        },
        adminNotes: {
            type: String,
            optional: true,
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    });

const disputeModel = mongoose.model("Dispute", dispute);

module.exports = disputeModel;