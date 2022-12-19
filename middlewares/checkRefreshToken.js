const jwt = require('jsonwebtoken');

/**
 * Check refreshToken exists, parse it and save userId to req
 * TODO: add expiration date and update
 */
module.exports = {
    checkRefreshToken(req, res, next) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).send('No refresh token');
        }

        jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH, undefined, (error, decoded) => {
            if (error) {
                return res.status(401).send('refreshToken is invalid')
            }

            const {userId} = decoded;

            req.userId = userId;

            next();
        })
    }
}