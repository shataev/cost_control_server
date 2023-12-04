const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");
const {v4} = require("uuid")
const Verification = require("../models/Verification")
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_VERIFICATION_EMAIL,
            pass: process.env.AUTH_VERIFICATION_PASSWORD
        }
    });
}

const getVerificationStringByUserId = (userId) => `${userId}${v4()}`

const getVerificationLinkByVerificationString = (verificationString) => `${process.env.CLIENT_URL}/email-verification/${verificationString}`

const getEmailConfig = (email, verificationLink) => ({
    form: process.env.AUTH_VERIFICATION_EMAIL,
    to: email,
    subject: 'WannaTrack. Verify your email',
    html: `<p>Verify your email to complete signup in WannaTrack App</p>
                <p>This link expires in 6 hours</p>
                <p>Press <a href=${verificationLink}>here</a> to proceed.</p>`
})

const sendVerificationEmailAsync = async (transporter, emailConfig) => {
    return new Promise((resolve, reject) => {
        return transporter.sendMail(emailConfig, (err, info) => {
            if (err) {
                console.log('[sendVerificationEmail sendMail] err', err)
                reject(err);
            } else {
                console.log('[sendVerificationEmail sendMail] info', info)
                resolve(info)
            }
        })
    })
}

module.exports = {
    async sendVerificationEmail(req, res, next){
        const user = req.user;
        const transporter = getTransporter();

        const verificationString = getVerificationStringByUserId(user.id)
        const verificationLink = getVerificationLinkByVerificationString(verificationString)

        const emailConfig = getEmailConfig(user.email, verificationLink)

        // Encrypt verificationString and save it to Verification table
        const encryptedVerificationString = CryptoJS.AES.encrypt(verificationString, process.env.SECRET_KEY).toString();
        const newVerification = new Verification({
            uniqueString: encryptedVerificationString,
            user: new ObjectId(user.id)
        })

        const verification = await newVerification.save();

        if (verification) {
            try {
                await sendVerificationEmailAsync(transporter, emailConfig);

                req.verificationEmailSendingStatus = 'success'
            } catch (e) {
                req.verificationEmailSendingStatus = 'error'
            }
        }

        next();
    }
}