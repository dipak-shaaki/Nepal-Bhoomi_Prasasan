const mongoose = require('mongoose');

const landSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    area: {
      value: { type: Number, required: true },
      unit: { type: String, required: true, enum: ['ropani', 'bigha', 'katha', 'square_meter'] },
      converted: { type: Number }, // Store value in square meters
    },
    location: {
      province: { type: String, required: true },
      district: { type: String, required: true },
      municipality: { type: String, required: true },
      ward: { type: String, required: true },
    },
    gps_coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    documents: {
      type: String, // Path to uploaded land document (PDF, Image)
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'For Sale', 'Sold', 'Rejected'],
      default: 'Pending',
    },
    price: {
      type: Number,
      required: function () { return this.isForSale; }
    },

    isForSale: {
      type: Boolean,
      default: false, // Default false; will be updated when selling
    },
    
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    transactionStatus: {
      type: String,
      enum: ['Available', 'Pending Sale', 'Completed'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

const Land = mongoose.model('Land', landSchema);
module.exports = Land;
