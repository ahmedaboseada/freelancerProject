const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create Schema
const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name required"],
            minlength: [2, "Too short name"],
            maxlength: [32, "Too long name"],
        },
        role: {
            type: String,
            enum: ["freelancer", "client", "admin"],
            required: [true, "Role required"],
        },
        email: {
            emailAddress: {
                type: String,
                required: [true, "Email required"],
                unique: true,
                lowercase: true,
            },
            isVerified: {
                type: Boolean,
                default: false,
            },
        },
        password: {
            type: String,
            required: [
                function () {
                    return !this.socialAuth?.googleId && !this.socialAuth?.facebookId;
                },
                "Password required",
            ],
            minlength: [8, "Too short password, minimum 8 characters"],
            maxlength: [64, "Too long password, maximum 64 characters"],
        },
        phone: {
            phoneNumber: {
                type: String,
                required: [
                    function () {
                        return !this.socialAuth?.googleId && !this.socialAuth?.facebookId;
                    },
                    "Phone number required",
                ],
                unique: true,
                sparse: true, // Allows multiple null/undefined values
            },
            isVerified: {
                type: Boolean,
                default: false,
            },
        },
        profilePicture: {
            type: String,
            default: "https://i.imgur.com/6VBx3io.png",
        },
        googleId: {
            type: String,
            sparse: true, // Allows multiple null/undefined values
            // unique: true, // Not needed as we are using socialAuth object

        },
        facebookId: {
            type: String,
            sparse: true, // Allows multiple null/undefined values
            // unique: true, // Not needed as we are using socialAuth object
        },
        socialAuth: {
            googleId: {
                type: String,
                null: true,
                // sparse: true, // Allows null/undefined values
            },
            facebookId: {
                type: String,
                null: true,
                // sparse: true,
            },
        },
        twoFAEnabled: {
            type: Boolean,
            default: false,
        },
        profile: {
            skills: {
                type: [String],
                required: [
                    function () {
                        return !this.socialAuth?.googleId && !this.socialAuth?.facebookId;
                    },
                    "At least one skill is required",
                ],
                validate: {
                    validator: function (v) {
                        return !this.socialAuth?.googleId && !this.socialAuth?.facebookId ? v.length > 0 : true;
                    },
                    message: "At least one skill is required",
                },
            },
            portfolio: {
                type: [String],
                required: [
                    function () {
                        return !this.socialAuth?.googleId && !this.socialAuth?.facebookId;
                    },
                    "At least one portfolio item is required",
                ],
                validate: {
                    validator: function (v) {
                        return !this.socialAuth?.googleId && !this.socialAuth?.facebookId ? v.length > 0 : true;
                    },
                    message: "At least one portfolio item is required",
                },
            },
            resumeUrl: {
                type: String,
                required: [
                    function () {
                        return this.role === "freelancer" && !this.socialAuth?.googleId && !this.socialAuth?.facebookId;
                    },
                    "Resume URL required for freelancers",
                ],
            },
            companyInfo: {
                companyName: {
                    type: String,
                    required: [
                        function () {
                            return this.role === "client";
                        },
                        "Company name required for clients",
                    ],
                },
                companyWebsite: {
                    type: String,
                    required: [
                        function () {
                            return this.role === "client";
                        },
                        "Company website required for clients",
                    ],
                },
            },
            hourlyRate: {
                type: Number,
                required: [
                    function () {
                        return this.role === "freelancer" && !this.socialAuth?.googleId && !this.socialAuth?.facebookId;
                    },
                    "Hourly rate required for freelancers",
                ],
            },
            rating: {
                type: Number,
                default: 0,
            },
            reviews: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Review",
                },
            ],
            balance:{
                type: String,
                default: null,
            }
        },
    },
    {
        timestamps: true, // Created At, Updated At
    }
);

// Add index on googleId field for faster queries
UserSchema.index({ "socialAuth.googleId": 1  }, { sparse: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;

// const mongoose = require("mongoose");
//
// const {Schema} = mongoose;
//
// // Create Schema
// const UserSchema = new Schema(
//     {
//         name: {
//             type: String,
//             required: [true, "Name required"],
//             minLength: [2, "Too short name"],
//             maxLength: [32, "Too long name"],
//         },
//         role: {
//             type: String,
//             enum: ['freelancer', 'client'],
//             required: [true, "Role required"],
//         },
//         email: {
//             emailAddress:
//                 {
//                     type: String,
//                     required: [true, "Email required"],
//                     unique: true,
//                     lowercase: true,
//                 }
//             ,
//             isVerified: {
//                 type: Boolean,
//                 default: false,
//             }
//         },
//         password: {
//             type: String,
//             required: [function () {
//                 return !this.socialAuth?.googleId;
//             }, "Password required"],
//             minLength: [8, "Too short password, minimum 8 characters"],
//             maxLength: [64, "Too long password, maximum 64 characters"],
//         },
//         phone: {
//             phoneNumber: {
//                 type: String,
//                 required: [true, "Phone number required"],
//                 unique: true,
//             },
//             isVerified: {
//                 type: Boolean,
//                 default: false,
//             }
//         },
//         profilePicture: {
//             type: String,
//             default: "https://i.imgur.com/6VBx3io.png",
//         },
//         socialAuth: {
//             googleId: {
//                 type: String,
//                 optional: true,
//             },
//             facebookId: {
//                 type: String,
//                 optional: true,
//             }
//         },
//         twoFAEnabled: {
//             type: Boolean,
//             default: false,
//         },
//         profile: {
//             skills: {
//                 type: [String],
//                 required: true,
//                 minLength: 1,
//             },
//             portfolio: {
//                 type: [String],
//                 required: true,
//                 minLength: 1,
//             },
//             resumeUrl: {
//                 type: String,
//                 required: function () {
//                     return this.role === 'freelancer';
//                 }
//             },
//             companyInfo: {
//                 companyName: {
//                     type: String,
//                     required: function () {
//                         return this.role === 'client';
//                     }
//                 },
//                 companyWebsite: {
//                     type: String,
//                     required: function () {
//                         return this.role === 'client';
//                     }
//                 }
//             },
//             hourlyRate: {
//                 type: Number,
//                 required: function () {
//                     return this.role === 'freelancer';
//                 }
//             },
//             rating: {
//                 type: Number,
//                 default: 0,
//             },
//             reviews: [
//                 {
//                     type: mongoose.Schema.Types.ObjectId,
//                     ref: "Review",
//                 }
//             ]
//         },
//     },
//     {
//         timestamps: true, // Created At, Updated At
//     },
// );
//
//
// UserSchema.index({ 'socialAuth.googleId': 1 });  // Add index on googleId field
//
//
// const user = mongoose.model("User", UserSchema);
// // const user = mongoose.models.User;
//
// module.exports = user;