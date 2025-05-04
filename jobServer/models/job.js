const mongoose = require("mongoose");

const {Schema} = mongoose;

// Create Schema
const jobSchema = new Schema(
    {
        clientId: {
            type: mongoose.Types.ObjectId, ref: "User",
            required: [true, "Client ID is required"],
        },
        title: {
            type: String,
            required: [true, "Job title is required"],
            minLength: [10, "Too short job title, minimum 10 characters"],
            maxLength: [255, "Too long job title, maximum 255 characters"],
        },
        description: {
            type: String,
            required: [true, "Job description is required"],
            minLength: [50, "Too short job description, minimum 50 characters"],
            maxLength: [2000, "Too long job description, maximum 2000 characters"],
        },
        skillsRequired: {
            type: [String],
            required: [true, "Skills required are required"],
            minLength: [1, "At least one skill is required"],
        },
        budget: {
            type: Number,
            required: [true, "Job budget is required"],
            min: [5, "Budget must be a positive number"], // Minimum budget is 5 dollars
        },
        timeline: {
            type: String,
            required: [true, "Job timeline is required"],
        },
        category: {
            type: String,
            required: [true, "Job category is required"],
            enum: [
                "Web Development",
                "Application Development",
                "Data Science",
                "Design",
                "Writing",
                "Marketing",
                "Sales",
                "Customer Support",
                "Other"
            ],
        },
        attachments: {
            type: [String],
            optional: true,
            maxLength: [10, "Maximum 10 attachments are allowed"],
        },
        status: {
            type: String,
            enum: ["open", "in progress", "completed"],
            default: "open",
        },
        proposals: {
            type: [mongoose.Types.ObjectId],
            ref: "Proposal",
            optional: true,
        },
        hiredFreelancer: {
            freelancer: {
                type: mongoose.Types.ObjectId,
                ref: "User",
                optional: true,
            },
            isHired: {
                type: Boolean,
                default: false,
            }
        },
        milestones: {
            type: [mongoose.Types.ObjectId],
            ref: "Milestone",
            optional: true,
        }
    },
    {
        timestamps: true, // Created At, Updated At
    }
)

const jobModel = mongoose.model("Job", jobSchema);

module.exports = jobModel;