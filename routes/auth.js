const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');

// SignUp
router.post('/signup', async (req, res) => {
  const {
    username,
    email,
    password: rawPassword
  } = req.body;

  const password = CryptoJS.AES.encrypt(rawPassword, process.env.SECRET_KEY).toString();

  const newUser = new User({
    username,
    email,
    password
  });

  try {
    const user = await newUser.save();

    res
      .status(201)
      .json(user);
  } catch (error) {
    res
      .status(500)
      .json(error);
  }
})

module.exports = router;
