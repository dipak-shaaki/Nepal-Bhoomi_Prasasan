const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to protect routes (Ensures user is logged in)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Middleware for Authorized Personnel (Admins & Govt Officials)
const isAuthorized = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'government')) {
    return res.status(403).json({ message: 'Access denied: Only authorized personnel can perform this action' });
  }
  next();
};

module.exports = { protect, isAuthorized }; // ✅ Export everything properly
// Ensure only `protect` is exported as default

