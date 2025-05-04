const mongoose = require("mongoose");
const {Mongoose} = require("mongoose");

const {Schema} = mongoose;

// Create Schema
const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name required"],
            minLength: [2, "Too short name"],
            maxLength: [32, "Too long name"],
        },
        email: {
            emailAddress:
                {
                    type: String,
                    required: [true, "Email required"],
                    unique: true,
                    lowercase: true,
                }
            ,
            isVerified: {
                type: Boolean,
                default: false,
            }
        },
        password: {
            type: String,
            required: [true, "Password required"],
            minLength: [8, "Too short password, minimum 8 characters"],
            maxLength: [64, "Too long password, maximum 64 characters"],
        },
        phone: {
            phoneNumber: {
                type: String,
                required: [true, "Phone number required"],
                unique: true,
            },
            isVerified: {
                type: Boolean,
                default: false,
            }
        },
        profilePicture: {
            type: String,
            default: "https://i.imgur.com/6VBx3io.png",
        },
        socialAuth: {
            googleId: {
                type: String,
                optional: true,
            },
            facebookId: {
                type: String,
                optional: true,
            }
        },
        twoFAEnabled: {
            type: Boolean,
            default: false,
        },
        profile: {
            skills: {
                type: [String],
                required: true,
                minLength: 1,
            },
            portfolio: {
                type: [String],
                required: true,
                minLength: 1,
            },
            resumeUrl: {
                type: String,
                required: function () {
                    return this.role === 'freelancer';
                }
            },
            companyInfo: {
                companyName: {
                    type: String,
                    required: function () {
                        return this.role === 'client';
                    }
                },
                companyWebsite: {
                    type: String,
                    required: function () {
                        return this.role === 'client';
                    }
                }
            },
            hourlyRate: {
                type: Number,
                required: function () {
                    return this.role === 'freelancer';
                }
            },
            rating: {
                type: Number,
                default: 0,
            },
            reviews: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Review",
                }
            ]
        },
    },
    {
        timestamps: true, // Created At, Updated At
    },
);

const user = mongoose.model("User", UserSchema);

module.exports = user;