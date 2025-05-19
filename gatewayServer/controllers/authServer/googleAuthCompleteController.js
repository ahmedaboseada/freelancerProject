const jwt = require('jsonwebtoken');
const responseWrapper = require('../../utils/responseWrapper');
const responseTypes = require('../../utils/responseTypes');
const ApiError = require('../../utils/apiError');

const googleAuthCompleteController = (req, res, next) => {
    try {
        const { accessToken } = req.cookies;  // Access token from cookies

        if (!accessToken) {
            return next(new ApiError("Access token is missing", responseTypes.UNAUTHORIZED.code));
        }

        // Verify the access token using JWT
        jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return next(new ApiError("Invalid access token", responseTypes.UNAUTHORIZED.code));
            }

            // If verified successfully, extract user details
            const { id, role } = decoded;

            // Generate new tokens
            const refreshToken = jwt.sign({ id, role }, process.env.JWT_REFRESH_TOKEN_SECRET, {
                expiresIn: "7d" // Set expiration for refresh token
            });

            // Generate a new access token with longer expiration for immediate use
            const newAccessToken = jwt.sign({ id, role }, process.env.JWT_ACCESS_TOKEN_SECRET, {
                expiresIn: "15m" // Longer expiration for immediate client use
            });

            // Store tokens in session
            req.session.refreshToken = refreshToken;
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            })
            req.session.userId = id;
            req.session.userRole = role;

            // Set cookies with proper flags
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                path: '/'
            });

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000, // 15 minutes
                path: '/'
            });

            // Force session save before responding
            req.session.save((err) => {
                if (err) {
                    console.error("Session save error:", err);
                    return next(new ApiError("Failed to save session", 500));
                }

                // Return all necessary data for client side
                return responseWrapper(res, responseTypes.SUCCESS, "Google OAuth Complete", {
                    refreshToken,
                    accessToken: newAccessToken,
                    userId: id,
                    role
                });
            });
        });
    } catch (error) {
        console.error("Google Auth Complete Error:", error);
        return next(new ApiError("Internal server error", 500));
    }
};

module.exports = googleAuthCompleteController;
