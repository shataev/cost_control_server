const jwt = require("jsonwebtoken");

const DEV_COOKIE_PARAMS = process.env.stage === 'development' ? {
    sameSite: "None",
    secure: true,
} : {
    //TODO: удалить, когда фронт и бек будут на одном домене
    sameSite: "None",
    //TODO: расскомментить, когда фронт будет хоститься на https
    //secure: true,
};

module.exports = {
    setRefreshTokenCookie(req, res, next) {
        const userId = req.user.id;

        const refreshToken = jwt.sign(
            {userId},
            process.env.SECRET_KEY_REFRESH,
            {
                expiresIn: '7d'
            }
        )

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            ...DEV_COOKIE_PARAMS
        });

        next();
    }
}