const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
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
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Assuming token is sent as "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Token is malformed or missing' });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    try {
      const user = await User.findByPk(decoded.id, { include: { model: Role, as: 'role' }});
      if (!user) {
        return res.status(404).json({ error: 'No user found' });
      }
      req.user = user;
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
