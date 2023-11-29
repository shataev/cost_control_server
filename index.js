const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const costRoute = require('./routes/cost');
const categoryRoute = require('./routes/category');
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
const ORIGIN = process.env.stage === 'development' ? 'http://localhost:5173' : process.env.CLIENT_URL;

app.use(cookieParser());
app.use(cors({
    origin: ORIGIN,
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'x-verification-code'],
    credentials: true,
    maxAge: 600,
    exposedHeaders: ['*', 'Authorization' ]
}));

// Built-in middleware for request body parsing
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api', [costRoute, categoryRoute]);


// Server starting
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})