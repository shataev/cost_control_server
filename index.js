const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
      console.log('DB successfully connected!')
  })
  .catch(e => {
      console.log(e)
  })

const app = express();

app.use(express.json());
app.use('/api/auth', authRoute);

app.listen(8800, () => {
    console.log('Server is running ')
})