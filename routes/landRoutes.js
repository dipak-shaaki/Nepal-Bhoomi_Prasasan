// routes/landRoutes.js
const express = require('express');
const router = express.Router();
const { registerLand, approveLand, editLand,sellLand, buyLand } = require('../controllers/landController');
const { protect, isAuthorized } = require('../middleware/authMiddleware'); // ✅ Fix import



// Register land (Only authenticated users)
router.post('/register', protect, registerLand);

// Approve land registration (Only Admin/Govt)
router.put('/approve/:id', protect, approveLand); //isAuthorized not used

// Request land edit (Only owner)
router.put('/edit/:id', protect, editLand);


// Sell land
router.put('/sell/:id', protect, sellLand);

// Buy land
router.put('/buy/:id', protect, buyLand);

module.exports = router;
