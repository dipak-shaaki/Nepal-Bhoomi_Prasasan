const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile,switchRole } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/switch-role', protect, switchRole);

module.exports = router;
