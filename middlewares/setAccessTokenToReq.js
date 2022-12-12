const jwt = require("jsonwebtoken");

module.exports = {
    setAccessTokenToReq(req, res, next) {
        const user = req.user;

        const accessToken = jwt.sign(
            { ...user },
            process.env.SECRET_KEY,
            { expiresIn: '5d' }
        );

        req.accessToken = accessToken;

        next();
    }
}