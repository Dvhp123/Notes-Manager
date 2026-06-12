const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// MongoDB Connection
// MongoDB Connection 
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    console.log('📂 DB:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ Mongo Error:', err.message);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
