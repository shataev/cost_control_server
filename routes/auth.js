const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const {setRefreshTokenCookie} = require('../middlewares/setRefreshTokenCookie');
const {createUser} = require("../middlewares/createUser");
const {setAccessTokenToReq} = require("../middlewares/setAccessTokenToReq");
const {checkUserInDatabase} = require("../middlewares/checkUserInDatabase");

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

// Logout
router.get('/logout', async (req, res) => {
  // Чистим куки
  // Отправляем 401
  res
      .status(401)
      .send('Successfully logged out');
})

module.exports = router;
