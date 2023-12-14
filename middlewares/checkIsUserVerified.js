module.exports = {
    checkIsUserVerified(req, res, next) {
        if (req.user.verified) {
            return res.status(400).json({
                message: 'Your email address is already verified'
            })
        } else {
            next();
        }
    }
}