const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile,switchRole } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware'); 

router.post('/register', registerUser); // Register a new user
router.post('/login', loginUser);// Login a user
// router.get('/profile', protect, getUserProfile); // Get user profile

module.exports = router;
