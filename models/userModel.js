const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 11000000 }, //here we can set default value to 0 later working on real life projects.
  role: {
    type: String,
    enum: ['user', 'government', 'admin'],
    default: 'user', // Default role
  },
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
}, { timestamps: true });

// Method to switch between Buyer & Seller
// userSchema.methods.switchRole = function () {
//   if (this.role === 'user') {
//     this.role = 'seller';
//   } else if (this.role === 'seller') {
//     this.role = 'user';
//   }
// };

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
