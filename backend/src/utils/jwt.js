const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Hash password
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// Compare password
const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

module.exports = { generateToken, verifyToken, hashPassword, comparePassword };