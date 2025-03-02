// controllers/landController.js
const Land = require('../models/landModel');
const convertToSquareMeter = require('../utils/convertToSqMeters');

// @desc Register new land (Requires Admin Approval)
// @route POST /api/land/register
// @access Private (Only Users)
const registerLand = async (req, res) => {
  try {
    const { location, gps_coordinates, area, landType, price, documents } = req.body;

    if (!location || !gps_coordinates || !area || !landType || !price || !documents) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Convert area to square meters
    const convertedArea = convertToSquareMeter(area.value, area.unit);

    //convert existing land
    const existingLand = await Land.findOne({
      'gps_coordinates.latitude': gps_coordinates.latitude,
      'gps_coordinates.longitude': gps_coordinates.longitude,
    });

    if (existingLand) {
      if (existingLand) {
        return res.status(400).json({ message: 'This land is already registered' });
      }
    }
    

    // Create new land entry
    const land = new Land({
      owner: req.user.id,
      location,
      gps_coordinates,
      area: {
        value: area.value,
        unit: area.unit,
        converted: convertedArea,
      },
      landType,
      price,
      documents,
      status: 'Pending', // Admin needs to approve
    });
    
    await land.save();
    res.status(201).json({ message: 'Land registered successfully, pending approval', land });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Approve land registration
// @route PUT /api/land/approve/:id
// @access Private (Only Admins/Govt)
const approveLand = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'government') {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    land.status = 'Approved';
    await land.save();
    res.status(200).json({ message: 'Land approved successfully', land });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Request Land Edit (User Request)
// @route PUT /api/land/edit/:id
// @access Private (Only Users)
const requestLandEdit = async (req, res) => {
  try {
    const { updates } = req.body;
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    if (land.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not the owner of this land' });
    }

    land.editRequest = true;
    land.editedDetails = updates;
    await land.save();

    res.status(200).json({ message: 'Edit request sent to admin', land });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Approve Land Edit (Admin/Govt)
// @route PUT /api/land/edit/approve/:id
// @access Private (Only Admins)
const approveLandEdit = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    if (req.user.role !== 'government') {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    land.area = land.editedDetails.area || land.area;
    land.location = land.editedDetails.location || land.location;
    land.gps_coordinates = land.editedDetails.gps_coordinates || land.gps_coordinates;
    land.price = land.editedDetails.price || land.price;
    land.editedDetails = null;
    land.editRequest = false;

    await land.save();
    res.status(200).json({ message: 'Land edit approved', land });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc List land for sale
// @route PUT /api/land/sell/:id
// @access Private (Only Owner)
const sellLand = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    if (land.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    if (land.status !== 'Approved') {
      return res.status(400).json({ message: 'Land must be approved before selling' });
    }

    land.isForSale = true;
    land.status = 'For Sale';
    land.transactionStatus = 'Available';

    await land.save();
    res.status(200).json({ message: 'Land listed for sale successfully', land });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Buy land
// @route PUT /api/land/buy/:id
// @access Private (Only Authenticated Users)
const buyLand = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    if (land.status !== 'For Sale' || !land.isForSale) {
      return res.status(400).json({ message: 'Land is not available for sale' });
    }

    if (land.owner.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot buy your own land' });
    }

    land.buyer = req.user.id;
    land.owner = req.user.id;
    land.status = 'Sold';
    land.isForSale = false;
    land.transactionStatus = 'Completed';

    await land.save();
    res.status(200).json({ message: 'Land purchased successfully', land });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerLand, approveLand, requestLandEdit, approveLandEdit ,sellLand, buyLand}; 
