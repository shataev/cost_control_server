const {generateRefreshToken, REFRESH_TOKEN_EXPIRATION_TIME_SECONDS} = require("../utils/auth.utils");

const DEV_COOKIE_PARAMS = process.env.stage === 'development' ? {
    sameSite: "none",
    httpOnly: true,
    secure: true,
} : {
    httpOnly: true,
    secure: true,
};

module.exports = {
    setRefreshTokenCookie(req, res, next) {
        const userId = req.user?.id || req.userId;

        console.log('[setRefreshTokenCookie] userId', userId)
        const refreshToken = generateRefreshToken(userId);

        res.cookie('refreshToken', refreshToken, {
            expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_TIME_SECONDS * 1000),
            ...DEV_COOKIE_PARAMS
        });

        next();
    }
}