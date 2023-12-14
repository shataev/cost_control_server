const {getVerificationByUserId, removeVerificationById} = require("../utils/verify.utils");
module.exports = {
    async deleteVerificationFromDatabase(req, res, next) {
        try {
            const verification = await getVerificationByUserId(req.userId);

            if (verification) {
                await removeVerificationById(verification._id);
            }
        } catch (e) {
            console.log('[deleteVerificationFromDatabase] error', e);

            return res.status(500).json('Something went wrong during deleting Verification');
        }

        next();
    }
}