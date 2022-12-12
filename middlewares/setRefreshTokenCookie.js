const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
    setRefreshTokenCookie(req, res, next) {
        const userId = req.user.id;

        const refreshToken = jwt.sign(
            {userId},
            process.env.SECRET_KEY_REFRESH,
            {
                expiresIn: '1m'
            }
        )

        res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

        next();
    }
}