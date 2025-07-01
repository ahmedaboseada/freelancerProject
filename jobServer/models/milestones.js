const mongoose = require("mongoose");

const {Schema} = mongoose;

const milestoneSchema = new Schema({
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
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            minlength: [20, "Milestone title must be at least 20 characters long"],
        },
        description: {
            type: String,
            required: true,
            minlength: [50, "Milestone description must be at least 20 characters long"],
            maxLength: [2000, "Milestone description must be at most 2000 characters long"],
        },
        amount: {
            type: Number,
            optional: true,
            min: [1, "Milestone amount must be at least 1"],
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "submitted","completed", "rejected"],
            default: "pending",
        },
        deliverableUrl: {
            type: String,
            optional: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid","escrowed", "released"],
            default: "escrowed",
        },
        rejectionReason: {
            type: String,
            optional: true,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            optional: true,
        }
    },
    {
        timestamps: true, // Created At, Updated At
    });


const milestoneModel = mongoose.model('Milestone', milestoneSchema)

module.exports = milestoneModel