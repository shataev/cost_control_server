const jwt = require("jsonwebtoken");
const {generateAccessToken} = require("../utils/auth.utils");

module.exports = {
    setAccessTokenToReq(req, res, next) {
        req.accessToken = generateAccessToken(req.user)

        next();
    }
}
