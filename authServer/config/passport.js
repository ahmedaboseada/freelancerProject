const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/auth/google/callback",
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                // Validate role against allowed values
                // const validRoles = ["freelancer", "client", "admin"];
                // let role = req.session.oauthRole || "freelancer";
                let role = req.session.oauthRole
                //
                // if (!validRoles.includes(role)) {
                //     role = "freelancer"; // Default to freelancer if invalid role
                // }
                //
                // console.log("Using role from session:", role);

                // First check if a user with this email already exists
                const existingEmail = await User.findOne({
                    "email.emailAddress": profile.emails[0].value
                });

                if (existingEmail) {
                    // User already exists with this email
                    console.log("User with this email already exists:", existingEmail);

                    // Update Google ID if not present
                    if (!existingEmail.socialAuth?.googleId) {
                        existingEmail.socialAuth = existingEmail.socialAuth || {};
                        existingEmail.socialAuth.googleId = profile.id;
                    }

                    // If user is a client, ensure they have company info
                    if (existingEmail.role === "client") {
                        // Set default company info if not present
                        if (!existingEmail.profile.companyInfo?.companyName) {
                            existingEmail.profile.companyInfo = existingEmail.profile.companyInfo || {};
                            existingEmail.profile.companyInfo.companyName = `${profile.displayName}'s Company`;
                        }

                        if (!existingEmail.profile.companyInfo?.companyWebsite) {
                            existingEmail.profile.companyInfo = existingEmail.profile.companyInfo || {};
                            existingEmail.profile.companyInfo.companyWebsite = `https://example.com/${profile.id}`;
                        }
                    }

                    await existingEmail.save();
                    const data = { _id: existingEmail._id, role: existingEmail.role };
                    return done(null, data);
                }

                // If no user with email, check for Google ID
                const existingGoogleUser = await User.findOne({
                    "socialAuth.googleId": profile.id
                });

                if (existingGoogleUser) {
                    console.log("User with Google ID already exists:", existingGoogleUser);
                    const data = { _id: existingGoogleUser._id, role: existingGoogleUser.role };
                    return done(null, data);
                }

                // If no existing user found, create a new one
                console.log("Creating new user:", profile);

                // Base user data with defaults
                const userData = {
                    name: profile.displayName,
                    email: {
                        emailAddress: profile.emails[0].value,
                        isVerified: true,
                    },
                    phone: {
                        phoneNumber: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                        isVerified: false
                    },
                    profilePicture: profile.photos[0].value,
                    role,
                    socialAuth: {
                        googleId: profile.id,
                    },
                    profile: {}
                };

                // Add role-specific profile data
                if (role === "client") {
                    userData.profile = {
                        companyInfo: {
                            companyName: `${profile.displayName}'s Company`,
                            companyWebsite: `https://example.com/${profile.id}`
                        },
                        skills: ["Default Skill"],
                        portfolio: ["https://example.com/portfolio"],
                        bio: "Client account created via Google OAuth"
                    };
                } else if (role === "freelancer") {
                    userData.profile = {
                        skills: ["JavaScript", "Web Development"],
                        portfolio: ["https://example.com/portfolio"],
                        bio: "Freelancer account created via Google OAuth",
                        hourlyRate: 25,
                        resumeUrl: `https://example.com/resume/${profile.id}`,
                        education: [],
                        experience: []
                    };
                } else if (role === "admin") {
                    userData.profile = {
                        skills: ["Administration"],
                        portfolio: ["https://example.com/admin"],
                        resumeUrl: `https://example.com/admin/resume/${profile.id}`,
                        hourlyRate: 0,
                        companyInfo: {
                            companyName: "Admin Company",
                            companyWebsite: "https://admin.example.com"
                        }
                    };
                }

                const newUser = await User.create(userData);

                const data = { _id: newUser._id, role: newUser.role };
                console.log("New user created:", newUser);
                return done(null, data);
            } catch (err) {
                console.error("Google OAuth Error:", err);
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;