const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const {setRefreshTokenCookie} = require('../middlewares/setRefreshTokenCookie');
const {createUser} = require("../middlewares/createUser");
const {generateAndSetAccessTokenToReq} = require("../middlewares/generateAndSetAccessTokenToReq");
const {checkUserInDatabase} = require("../middlewares/checkUserInDatabase");
const {checkVerificationCodeHeader} = require("../middlewares/checkVerificationCodeHeader");
const {checkRefreshToken} = require("../middlewares/checkRefreshToken");
const {checkUserInDatabaseById} = require("../middlewares/checkUserInDatabaseById");

// Silent Authentication
router.get('/', [
    checkVerificationCodeHeader,
    checkRefreshToken,
    checkUserInDatabaseById,
    generateAndSetAccessTokenToReq,
    (req, res) => {
        res
            .status(201)
            .json({
                ...req.user,
                accessToken: req.accessToken});



}])

// SignUp
router.post('/signup', [
    createUser,
    setRefreshTokenCookie,
    generateAndSetAccessTokenToReq,
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
    generateAndSetAccessTokenToReq,
    (req, res) => {
        res.status(201)
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
