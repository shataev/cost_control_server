const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const costRoute = require('./routes/cost');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 8800;

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
      console.log('DB successfully connected!')
  })
  .catch(e => {
      console.log(e)
  })

const app = express();

// CORS set up
//TODO: заменить http://gundrov.com/ на адрес сервера на ВПС
//const ORIGIN = process.env.stage === 'development' ? 'http://127.0.0.1:5173' : true
const ORIGIN = process.env.stage === 'development' ? 'http://127.0.0.1:5173' : 'http://gundrov.com'

app.use(cookieParser());
app.use(cors({
    origin: ORIGIN,
    credentials: true
}));

// Built-in middleware for request body parsing
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api', costRoute);


// Server starting
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})