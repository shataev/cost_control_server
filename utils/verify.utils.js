const Verification = require('../models/Verification')
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getVerificationByUserId = async (userId) => {
    const verification = await Verification.findOne({user: new ObjectId(userId)});

    if (verification) {
        return verification
    }

    return false;
}

const checkVerificationExpiration = (expirationDate) => {
    return expirationDate < new Date();
}

const removeVerificationById = async (verificationId) => {
    await Verification.deleteOne({_id: verificationId})
}

const VERIFICATION_EMAIL_STATUS_NOT_FOUND = 'not-found';
const VERIFICATION_EMAIL_STATUS_USER_NOT_FOUND = 'user-not-found';
const VERIFICATION_EMAIL_STATUS_ALREADY_VERIFIED = 'already-verified';
const VERIFICATION_EMAIL_STATUS_SUCCESS = 'success';
const VERIFICATION_EMAIL_STATUS_ERROR = 'error';
const VERIFICATION_EMAIL_STATUS_INVALID = 'invalid';
const VERIFICATION_EMAIL_STATUS_EXPIRED = 'expired';

module.exports = {
    getVerificationByUserId,
    checkVerificationExpiration,
    removeVerificationById,
    VERIFICATION_EMAIL_STATUS_NOT_FOUND,
    VERIFICATION_EMAIL_STATUS_SUCCESS,
    VERIFICATION_EMAIL_STATUS_ERROR,
    VERIFICATION_EMAIL_STATUS_INVALID,
    VERIFICATION_EMAIL_STATUS_EXPIRED,
    VERIFICATION_EMAIL_STATUS_USER_NOT_FOUND,
    VERIFICATION_EMAIL_STATUS_ALREADY_VERIFIED
}