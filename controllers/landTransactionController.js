// controllers/landTransactionController.js
const Land = require('../models/landModel');

// @desc List land for sale
// @route PUT /api/land/sell/:id
// @access Private (Only Land Owner)
const listLandForSale = async (req, res) => {
  try {
    const { price } = req.body;
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    // Check if the logged-in user is the land owner
    if (land.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to sell this land' });
    }

    land.isForSale = true;
    land.price = price;
    await land.save();

    res.status(200).json({ message: 'Land listed for sale', land });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Search land by ID or location
// @route GET /api/land/search
// @access Public
const searchLand = async (req, res) => {
  try {
    const { landId, province, district, minPrice, maxPrice } = req.query;

    let filter = { isForSale: true };

    if (landId) filter._id = landId;
    if (province) filter['location.province'] = province;
    if (district) filter['location.district'] = district;
    if (minPrice) filter.price = { $gte: minPrice };
    if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice };

    const lands = await Land.find(filter);
    res.status(200).json({ message: 'Lands retrieved', lands });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Initiate Land Purchase
// @route PUT /api/land/buy/:id
// @access Private (Only Buyers)
const initiatePurchase = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land || !land.isForSale) {
      return res.status(404).json({ message: 'Land not found or not for sale' });
    }

    if (land.owner.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot buy your own land' });
    }

    land.transactionStatus = 'Under Review';
    land.buyer = req.user.id;
    await land.save();

    res.status(200).json({ message: 'Purchase initiated, waiting for approval', land });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Confirm ownership transfer (Blockchain integration simulation)
// @route PUT /api/land/transfer/:id
// @access Private (Only Admins/Govt)
const confirmOwnershipTransfer = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land || land.transactionStatus !== 'Under Review') {
      return res.status(404).json({ message: 'Transaction not found or not in review' });
    }

    if (req.user.role !== 'government') {
      return res.status(403).json({ message: 'Only government officials can approve transfers' });
    }

    land.owner = land.buyer; // Transfer ownership
    land.buyer = null;
    land.transactionStatus = 'Completed';
    land.isForSale = false;
    await land.save();

    res.status(200).json({ message: 'Ownership transferred successfully', land });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { listLandForSale, searchLand, initiatePurchase, confirmOwnershipTransfer };
