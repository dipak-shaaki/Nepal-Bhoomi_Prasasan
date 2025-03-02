const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'government', 'admin'],
    default: 'buyer', // Default role
  },
}, { timestamps: true });

// Method to switch between Buyer & Seller
userSchema.methods.switchRole = function () {
  if (this.role === 'buyer') {
    this.role = 'seller';
  } else if (this.role === 'seller') {
    this.role = 'buyer';
  }
};

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
