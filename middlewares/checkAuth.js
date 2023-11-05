const jwt = require('jsonwebtoken');
const {getUserFromDatabaseById, generateAccessToken} = require("../utils/auth.utils");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const checkRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        // Check if the refresh token exists
        if (!refreshToken) {
            throw new Error('Unauthorized: no refreshToken');
        }

        // Verify refresh token and generate new access token
        const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH);
        const {userId} = decoded;

        const user = await getUserFromDatabaseById(userId);

        // Check if user exists
        if (!user) {
            throw new Error('Unauthorized: user was not found in database');
        }

        // generate new accessToken
        const newAccessToken = generateAccessToken({
            username: user.username,
            email: user.email,
            id: user.id
        })

        req.user = user;

        res.setHeader('Authorization', 'Bearer ' + newAccessToken)
        next();
    } catch (error) {
        console.log('error', error)
        res.status(401).json({ message: error.message });
    }
}
const checkAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const accessToken = authHeader.split(' ')?.[1];
            const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
            const {id} = decoded;

            const user = await getUserFromDatabaseById(id);

            if (!user) {
                throw new Error('Unauthorized: user was not found in database');
            }

            req.user = user

            next();
        } else {
            throw new Error('Unauthorized: no accessToken');
        }
    } catch (error) {
        console.log('[checkAccessToken] error', error);
        if (error.name === 'TokenExpiredError') {
            return await checkRefreshToken(req, res, next)
        }

        res.status(401).json({ message: error.message });
    }
}

/**
 * Check access and refresh tokens and update it
 */
module.exports = {
    checkAccessToken
}
