const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const saltRounds = 10;
const secretKey = process.env.JWT_SECRET_KEY;

/**
 * Hashes a password using bcrypt.
 * 
 * @param {string} password - The plain text password to hash.
 * 
 * @returns {Promise<string>} A promise that resolves with the hashed password.
 * 
 * @throws {Error} Throws an error if there is an issue hashing the password.
 * 
 * @example
 * const hashedPassword = await hashPassword('myPassword');
 */
async function hashPassword(password) {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

/**
 * Compares a plain text password with a hashed password.
 * 
 * @param {string} password - The plain text password to compare.
 * @param {string} hash - The hashed password to compare against.
 * 
 * @returns {Promise<boolean>} A promise that resolves with `true` if the passwords match, `false` otherwise.
 * 
 * @throws {Error} Throws an error if there is an issue comparing the passwords.
 * 
 * @example
 * const isMatch = await comparePassword('myPassword', hashedPassword);
 */
async function comparePassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    throw new Error('Error comparing password');
  }
}

/**
 * Generates a JWT token for a user.
 * 
 * @param {Object} user - The user object containing user details.
 * @param {number} user.id - The user ID.
 * @param {string} user.username - The username of the user.
 * @param {string} user.role - The role of the user.
 * 
 * @returns {string} The generated JWT token.
 * 
 * @example
 * const token = generateToken(user);
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

/**
 * Middleware function to verify JWT token and attach user to request.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 * 
 * @returns {void} Calls the next middleware function or sends an error response.
 * 
 * @throws {Error} Throws an error if there is an issue verifying the token or fetching the user.
 * 
 * @example
 * app.use('/protected', verifyToken, (req, res) => {
 *   res.send('Protected content');
 * });
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);

  if (!authHeader) {
    console.log('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token:', token);
  if (!token) {
    console.log('Token is malformed or missing');
    return res.status(401).json({ error: 'Token is malformed or missing' });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    try {
      console.log('Decoded Token:', decoded);
      const userId = parseInt(decoded.id, 10); // Convert to number
      if (isNaN(userId)) {
        console.log('Invalid user ID');
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      const user = await User.findOne({ where: { id: userId }});
      if (!user) {
        console.log('No user found');
        return res.status(404).json({ error: 'No user found' });
      }
      req.user = user;
      console.log('User found:', user);
      next();
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Error fetching user' });
    }
  });
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};
