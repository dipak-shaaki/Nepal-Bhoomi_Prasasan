// controllers/landController.js

const Land = require('../models/landModel');
const convertToSquareMeter = require('../utils/convertToSqMeters');
const { calculateTax } = require('../utils/taxCalculator');
const User = require('../models/userModel'); // Import the User model

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
      return res.status(404).json({ message: "Land not found" });
    }

    // Check if the user is an admin
    // Check if the user is an admin
    if (req.user.role !== 'admin' && req.user.role !== 'government') {
      return res.status(403).json({ message: 'Unauthorized action: Only admins/government officials can approve land' });
    }

    land.status = 'Approved';
    await land.save();


    res.status(200).json({ message: "Land approved successfully", land });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// @desc Request Land Edit (User Request)
// @route PUT /api/land/edit/:id
// @access Private (Only Users)

const editLand = async (req, res) => {
  try {
    const { updates } = req.body;
    const land = await Land.findById(req.params.id);

    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    // ✅ Ensure only the landowner can edit
    if (land.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not the owner of this land' });
    }

    // ✅ Apply only the fields that are updated, keep existing values for other fields
    land.price = updates.price ?? land.price;
    land.location = {
      province: updates.location?.province ?? land.location.province,
      district: updates.location?.district ?? land.location.district,
      municipality: updates.location?.municipality ?? land.location.municipality,
      ward: updates.location?.ward ?? land.location.ward,
    };
    land.gps_coordinates = {
      latitude: updates.gps_coordinates?.latitude ?? land.gps_coordinates.latitude,
      longitude: updates.gps_coordinates?.longitude ?? land.gps_coordinates.longitude,
    };

    await land.save();

    res.status(200).json({ message: 'Land updated successfully', land });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// @desc Approve Land Edit (Admin/Govt)
// @route PUT /api/land/edit/approve/:id
// @access Private (Only Admins)


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
      return res.status(403).json({ message: 'You can only sell your own land' });
    }

    land.isForSale = true;
    land.status = 'For Sale';
    await land.save();

    res.status(200).json({ message: 'Land listed for sale successfully', land });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @desc Buy land
// @route PUT /api/land/buy/:id
// @access Private (Only Authenticated Users)
// const buyLand = async (req, res) => {
//   try {
//     // ✅ Fetch the land
//     const land = await Land.findById(req.params.id);
//     if (!land) {
//       return res.status(404).json({ message: 'Land not found' });
//     }

//     // ✅ Fetch the buyer and seller
//     const buyer = await User.findById(req.user.id);
//     const seller = await User.findById(land.owner);

//     if (!buyer || !seller) {
//       return res.status(404).json({ message: 'Buyer or Seller not found' });
//     }

//     if (!land.isForSale) {
//       return res.status(400).json({ message: 'Land is not for sale' });
//     }

//     if (land.owner.toString() === buyer._id.toString()) {
//       return res.status(403).json({ message: 'You cannot buy your own land' });
//     }

//     // ✅ Ensure buyer role is NOT modified
//     console.log("Buyer Role Before:", buyer.role);

//     // ✅ Calculate tax
//     const taxAmount = calculateTax(land.price);
//     const totalCost = land.price + taxAmount;

//     if (buyer.balance < totalCost) {
//       return res.status(400).json({ message: 'Insufficient funds' });
//     }

//     // ✅ Deduct balance & transfer ownership
//     buyer.balance -= totalCost;
//     seller.balance += land.price;

//     land.owner = buyer._id;
//     land.status = 'Sold';
//     land.isForSale = false;
//     land.buyer = buyer._id;
//     land.transactionStatus = 'Completed';

//     await buyer.save();
//     await seller.save();
//     await land.save();


//     console.log("Buyer Role After:", buyer.role); // ✅ Ensure role is unchanged


//     res.status(200).json({
//       message: 'Land purchased successfully',
//       land,
//       taxPaid: taxAmount,
//       finalAmountPaid: totalCost,
//     });
//   } catch (error) {
//     console.error('Error in buyLand:', error.message);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };




//updated for ownership control
// @desc Buy land
// @route PUT /api/land/buy/:id
// @access Private (Only Authenticated Users)
const buyLand = async (req, res) => {
  try {
    // ✅ Fetch the land
    const land = await Land.findById(req.params.id);
    if (!land) {
      return res.status(404).json({ message: 'Land not found' });
    }

    // ✅ Fetch the buyer and seller
    const buyer = await User.findById(req.user.id);
    const seller = await User.findById(land.owner);

    if (!buyer || !seller) {
      return res.status(404).json({ message: 'Buyer or Seller not found' });
    }

    if (!land.isForSale) {
      return res.status(400).json({ message: 'Land is not for sale' });
    }

    if (land.owner.toString() === buyer._id.toString()) {
      return res.status(403).json({ message: 'You cannot buy your own land' });
    }

    // ✅ Calculate tax
    const taxAmount = calculateTax(land.price);
    const totalCost = land.price + taxAmount;

    if (buyer.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // ✅ Transfer ownership & update balances
    buyer.balance -= totalCost;
    seller.balance += land.price;

    land.owner = buyer._id;  // 🔥 Ownership is transferred!
    land.status = 'Sold';
    land.isForSale = false;
    land.buyer = buyer._id;
    land.transactionStatus = 'Completed';

    await buyer.save();
    await seller.save();
    await land.save();

    res.status(200).json({
      message: 'Land purchased successfully!',
      land,
      newOwner: buyer.name,  // ✅ Show new owner details in response
      taxPaid: taxAmount,
      finalAmountPaid: totalCost,
    });
  } catch (error) {
    console.error('Error in buyLand:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



module.exports = { registerLand, approveLand, editLand, sellLand, buyLand }; 