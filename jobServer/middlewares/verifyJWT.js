const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const token = req.session.refreshToken

    if (!token) {
        return res.status(401).json({message: "Unauthorized"});
    }

    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({message: "Forbidden"});
        }
        req.user = decoded;
        next();
    })

}

module.exports = verifyJWT;