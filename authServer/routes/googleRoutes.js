// authServer/routes/googleRoutes.js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Step 1: Redirect to Google
router.get("/google", (req, res, next) => {
    // Get role from query params with validation
    let { role } = req.query; // Default to 'freelancer' instead of 'user'

    // Validate role against allowed values
    // const validRoles = ["freelancer", "client", "admin"];
    // if (!validRoles.includes(role)) {
    //     role = "freelancer"; // Default to freelancer if invalid role provided
    // }

    const state = JSON.stringify({
        role,
        sig: "optionalSignatureHere",
    });

    // Store role in session for later use
    req.session.oauthRole = role;

    passport.authenticate("google", {
        scope: ["profile", "email"],
        state,
        session: true,
    })(req, res, next);
});

// Step 2: Handle Google callback
router.get(
    "/google/callback",
    (req, res, next) => {
        try {
            // Parse the state
            if (req.query.state) {
                const state = JSON.parse(decodeURIComponent(req.query.state));

                // // Validate role against allowed values
                // const validRoles = ["freelancer", "client", "admin"];
                // let role = state.role || "freelancer";
                // if (!validRoles.includes(role)) {
                //     role = "freelancer"; // Default to freelancer if invalid role provided
                // }

                // Store the validated role in the session
                req.session.oauthRole = state.role;
            }
            next();
        } catch (err) {
            console.error("Invalid state parameter:", err);
            return res.status(400).json({ message: "Invalid state parameter" });
        }
    },
    passport.authenticate("google", {
        failureRedirect: "/api/auth/google/failure",
        session: true,
    }),
    (req, res) => {
        // Generate JWT tokens after successful authentication
        const accessToken = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" }
        );
        console.log("Access Token:", accessToken);

        const refreshToken = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_REFRESH_TOKEN_SECRET
        );

        // Set access token as a cookie
        res.cookie("accessToken", accessToken, {
            expires: new Date(Date.now() + 30000),
            maxAge: 30000,
            httpOnly: true,
        });
        console.log(req.cookies);

        // Redirect to the complete page after OAuth is done
        res.redirect('https://frgatewayserver.vercel.app/api/auth/googleAuthComplete');
    }
);

// Failure route
router.get("/google/failure", (req, res) => {
    res.status(401).json({ message: "Google authentication failed" });
});

module.exports = router;