const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const costRoute = require('./routes/cost');
const cors = require('cors');
const cookieParser = require("cookie-parser");

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
      console.log('DB successfully connected!')
  })
  .catch(e => {
      console.log(e)
  })

const app = express();

app.use(cookieParser())
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api', costRoute);

app.listen(8800, () => {
    console.log('Server is running ')
})