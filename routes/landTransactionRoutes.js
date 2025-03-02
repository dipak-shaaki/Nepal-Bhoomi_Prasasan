const express = require('express');
const router = express.Router();
const {
  listLandForSale,
  searchLand,
  initiatePurchase,
  confirmOwnershipTransfer,
} = require('../controllers/landTransactionController');
const protect = require('../middleware/authMiddleware');

// List land for sale
router.put('/sell/:id', protect, listLandForSale);

// Search available lands
router.get('/search', searchLand);

// Initiate purchase
router.put('/buy/:id', protect, initiatePurchase);

// Confirm ownership transfer
router.put('/transfer/:id', protect, confirmOwnershipTransfer);

module.exports = router;
