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

// CORS set up
const ORIGIN = process.env.stage === 'development' ? 'http://127.0.0.1:5173' : true

app.use(cookieParser());
app.use(cors({
    // TODO завязать наличие этого параметра на режим сборки
    origin: ORIGIN,
    credentials: true
}));

// Built-in middleware for request body parsing
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api', costRoute);


// Server starting
app.listen(8800, () => {
    console.log('Server is running ')
})