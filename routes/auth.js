const router = require('express').Router();
const {setRefreshTokenCookie} = require('../middlewares/setRefreshTokenCookie');
const {createUser} = require("../middlewares/createUser");
const {setAccessTokenToReq} = require("../middlewares/setAccessTokenToReq");
const {checkUserInDatabase} = require("../middlewares/checkUserInDatabase");
const {checkVerificationCodeHeader} = require("../middlewares/checkVerificationCodeHeader");
const {checkAuth, checkAccessToken} = require("../middlewares/checkAuth");

// Silent Authentication
router.get('/', [
    checkVerificationCodeHeader,
    checkAccessToken,
    setRefreshTokenCookie,
    (req, res) => {
        res
            .status(201)
            .json({
                ...req.user,
                accessToken: req.accessToken});
}])

// SignUp
router.post('/signup', [
    checkVerificationCodeHeader,
    createUser,
    setRefreshTokenCookie,
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
    checkVerificationCodeHeader,
    checkUserInDatabase,
    setRefreshTokenCookie,
    setAccessTokenToReq,
    (req, res) => {
        res.status(200)
            .json({
                ...req.user,
                accessToken: req.accessToken});
    }
])

// SignOut
router.post('/signout', async (req, res) => {
    // Clear cookie
    res.cookie('refreshToken', null, {
        httpOnly: true,
        expires: new Date(Date.now()),
    });

    res
      .status(200)
      .send('Successfully logged out');
})

module.exports = router;
