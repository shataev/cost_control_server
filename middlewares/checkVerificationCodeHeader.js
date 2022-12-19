/**
 * Check X-Verification-Code header for silent authentication
 */
module.exports = {
    checkVerificationCodeHeader(req, res, next) {
        // Check verification code header
        const verificationCodeFromHeader = req.header('X-Verification-Code');
        const verificationCode = process.env.VERIFICATION_CODE;

        if (verificationCode !== verificationCodeFromHeader) {
            return res.status(401).send('No X-Verification-Code');
        }

        next();
    }
}