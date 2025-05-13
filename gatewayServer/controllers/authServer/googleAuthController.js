// gatewayServer/controllers/authServer/googleAuthController.js
const { fetchAnotherServerWithQuery } = require('../../utils/fetchAnotherServer');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const googleAuthController = async (req, res, next) => {
    try {
        console.log(req.session.refreshToken)
        if (req.session.refreshToken) {
            console.log("Already logged in");
            return next(new ApiError("You are already logged in", responseTypes.BAD_REQUEST.code));
        }
        console.log(req.session.refreshToken)

        let { role } = req.query;  // Get role from query params

        // Validate role against allowed values
        const validRoles = ["freelancer", "client", "admin"];
        if (!role || !validRoles.includes(role)) {
            role = "freelancer"; // Default to freelancer if invalid role or no role provided
        }

        // Construct state with role and optional signature
        const state = JSON.stringify({
            role,
            sig: "optionalSignatureHere",
        });

        // Redirect to Google OAuth with state parameter
        const redirectUrl = `${process.env.AUTH_SERVER}/api/auth/google?state=${encodeURIComponent(state)}`;
        return res.redirect(redirectUrl);
    } catch (error) {
        console.error("Google OAuth Redirect Error:", error);
        return next(new ApiError("Internal server error", 500));
    }
};

module.exports = googleAuthController;