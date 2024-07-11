const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const Role = require('../models/role')
require('dotenv').config();

const saltRounds = 10;
const secretKey = process.env.JWT_SECRET_KEY;

// Хеширование пароля
async function hashPassword(password) {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}

// Проверка пароля
async function comparePassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error) {
    throw new Error('Error comparing password');
  }
}

// Генерация JWT токена
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    roleId: user.roleId,
  };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

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
      const userId = parseInt(decoded.id, 10); // Преобразование в число
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
