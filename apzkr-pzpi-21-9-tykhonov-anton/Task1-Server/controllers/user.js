const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const { hashPassword, comparePassword, generateToken } = require('../middlewares/authMiddleware');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

// CREATE a new user
router.post('/', asyncHandler(async (req, res) => {
  const { username, password, role, email, img, longitude, latitude } = req.body;

  // Basic validation
  if (!username || !password || !email || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    password: hashedPassword,
    role,
    email,
    img,
    longitude,
    latitude,
  });

  res.status(201).json(user);
}));

// GET all users (requires token)
router.get('/', verifyToken, asyncHandler(async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

// UPDATE user by ID (requires token)
router.put('/:id', verifyToken, asyncHandler(async (req, res) => {
  const { username, password, role, img, email, longitude, latitude } = req.body;
  const user = await User.findByPk(req.params.id);

  if (user) {
    await user.update({
      username: username || user.username,
      password: password ? await hashPassword(password) : user.password,
      role: role || user.role,
      email: email || user.email,
      img: img || user.img,
      longitude: longitude || user.longitude,
      latitude: latitude || user.latitude,
    });
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
}));

// DELETE user by ID (requires token)
router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
}));

// LOGIN a user
router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const match = await comparePassword(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.status(200).json({ token, user });
}));

// GET user data by token (using '/data' route)
router.get('/data', verifyToken, asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  // Ensure authorization header is provided
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Split and extract the token from the authorization header
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token is malformed or missing' });
  }

  try {
    // Verify the token and extract user ID
    const decoded = jwt.verify(token, secretKey);
    const userId = parseInt(decoded.id, 10);

    // Fetch user details using the ID from the token
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'No user found' });
    }

    // Return user details
    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ error: 'Failed to authenticate token' });
  }
}));

module.exports = router;
