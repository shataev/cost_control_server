const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

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

// SignIn
router.post('/signin', async (req, res) => {
  const {
    email,
    password: passwordFromClient
  } = req.body;


  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(401).json('Wrong email or password');
    }

    const bytes  = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const passwordFromDb = bytes.toString(CryptoJS.enc.Utf8);

    if (passwordFromClient !== passwordFromDb) {
      return res.status(401).json('Wrong email or password');
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: '5d' }
    );

    const {password, ...userData} = user._doc;
    const responseData = {...userData, accessToken};

    res.status(201).json(responseData);
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;
