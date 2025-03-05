const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail'); //
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate role (only 'user', 'admin', 'government' allowed)
    const allowedRoles = ['user', 'admin', 'government'];
    const assignedRole = allowedRoles.includes(role) ? role : 'user';

    // Create new user
    const user = await User.create({ name, email, password, role: assignedRole });

    if (user) {
      res.status(201).json({
        message: 'User registered successfully. Please login to continue.',
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Authenticate user & get token
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        message: 'User logged in successfully',
        token: generateToken(user.id, user.role), // Send token for later use
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private
const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// const switchRole = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Only buyers and sellers can switch roles
//     if (user.role === 'government' || user.role === 'admin') {
//       return res.status(403).json({ message: 'Admins/Government officials cannot switch roles' });
//     }

//     // @desc Switch between buyer and seller roles
//     // @route PUT /api/auth/switch-role
//     // @access Private (Only Buyer/Seller)

//     // Switch role
//     user.switchRole();
//     await user.save();

//     res.status(200).json({ message: `Role switched to ${user.role}`, role: user.role });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// @desc Request Password Reset
// @route POST /api/auth/forgot-password
// @access Public
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // ✅ Send Reset Email
    const resetURL = `http://localhost:5000/api/auth/reset-password/${resetToken}`;
    await sendEmail(user.email, 'Password Reset', `Click here to reset your password: ${resetURL}`);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc Reset Password (Using Token)
// @route PUT /api/auth/reset-password/:token
// @access Public

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }, // Ensure token is valid
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // ✅ Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



module.exports = { registerUser, loginUser, getUserProfile, requestPasswordReset, resetPassword };
