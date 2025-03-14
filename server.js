const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const landRoutes = require('./routes/landRoutes');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/land', landRoutes);
app.use(cors());

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
