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

            console.log("before", req.session.refreshToken);

            // Store tokens in session
            req.session.refreshToken = refreshToken;
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

                console.log("after", req.session.refreshToken);

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

// const jwt = require('jsonwebtoken');
// const responseWrapper = require('../../utils/responseWrapper');
// const responseTypes = require('../../utils/responseTypes');
// const ApiError = require('../../utils/apiError');
//
// const googleAuthCompleteController = (req, res, next) => {
//     const { accessToken } = req.cookies;  // Access token from cookies
//
//     if (!accessToken) {
//         return next(new ApiError("Access token is missing", responseTypes.UNAUTHORIZED.code));
//     }
//
//     // Verify the access token using JWT
//     jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return next(new ApiError("Invalid access token", responseTypes.UNAUTHORIZED.code));
//         }
//
//         // If verified successfully, extract user details
//         const { id, role } = decoded;
//
//         // Generate new tokens or perform necessary actions
//         const refreshToken = jwt.sign({ id, role }, process.env.JWT_REFRESH_TOKEN_SECRET, {
//             expiresIn: "7d" // Set expiration for refresh token
//         });
//
//         console.log("before", req.session.refreshToken);
//         req.session.refreshToken = refreshToken;
//
//         // Set refreshToken as a cookie for better persistence
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//             path: '/'
//         });
//
//         // Save the session before sending response
//         req.session.save((err) => {
//             if (err) {
//                 console.error("Session save error:", err);
//                 return next(new ApiError("Failed to save session", 500));
//             }
//
//             console.log("after", req.session.refreshToken);
//
//             // Return JSON response with refresh token instead of redirecting
//             return responseWrapper(res, responseTypes.SUCCESS, "Google OAuth Complete", {
//                 refreshToken
//             });
//         });
//     });
// };
//
// module.exports = googleAuthCompleteController;