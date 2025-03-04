const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, requestPasswordReset, resetPassword } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware'); 

router.post('/register', registerUser); // Register a new user
router.post('/login', loginUser);// Login a user

// router.get('/profile', protect, getUserProfile); // Get user profile

router.post('/forgot-password', requestPasswordReset);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
