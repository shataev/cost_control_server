const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const {setRefreshTokenCookie} = require('../middlewares/setRefreshTokenCookie');
const {createUser} = require("../middlewares/createUser");
const {setAccessTokenToReq} = require("../middlewares/setAccessTokenToReq");
const {checkUserInDatabase} = require("../middlewares/checkUserInDatabase");

// Silent Authentication
router.get('/', (req, res) => {
    // Check verification code header
    const verificationCodeFromHeader = req.header('X-Verification-Code');
    const verificationCode = process.env.VERIFICATION_CODE;

    if (verificationCode !== verificationCodeFromHeader) {
        return res.status(401).send('No X-Verification-Code');
    }

    // Check refreshToken
    // TODO вынести в миддлвару
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).send('No refresh token');
    }

    res.status(200).json({
        verificationCodeHeaderValue: verificationCodeFromHeader,
        refreshToken
    });

})

// SignUp
router.post('/signup', [
    createUser,
    setRefreshTokenCookie,
    setAccessTokenToReq,
    (req, res) => {
      res
          .status(201)
          .json({
            ...req.user,
            accessToken: req.accessToken});
  }
])

// SignIn
router.post('/signin', [
    checkUserInDatabase,
    setRefreshTokenCookie,
    setAccessTokenToReq,
    (req, res) => {
        res
            .status(201)
            .json({
                ...req.user,
                accessToken: req.accessToken});
    }
])

// SignOut
router.get('/signout', async (req, res) => {
    // Clear cookie
    res.cookie('refreshToken', null, {
        maxAge: 0
    });

    res
      .status(401)
      .send('Successfully logged out');
})

module.exports = router;
