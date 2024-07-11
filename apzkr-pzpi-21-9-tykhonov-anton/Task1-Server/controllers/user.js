const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Role = require('../models/role');
const { hashPassword, comparePassword, generateToken } = require('../middlewares/authMiddleware');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;



router.post('/', asyncHandler(async (req, res) => {
  const { username, password, roleId } = req.body;

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    password: hashedPassword,
    roleId,
  });

  res.status(201).json(user);
}));

router.get('/', verifyToken, asyncHandler(async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Role,
        as: 'role',
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}));

router.put('/:id', verifyToken, asyncHandler(async (req, res) => {
  const { username, password, roleId } = req.body;
  const user = await User.findByPk(req.params.id);

  if (user) {
    await user.update({
      username,
      password: password ? await hashPassword(password) : user.password,
      roleId,
    });
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
}));

router.delete('/:id', verifyToken, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username }, include: { model: Role, as: 'role' } });

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
// КАКИМ ОБРАЗОМ ОН ПЕРЕКРЫВАЕТ /data????
// router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
//   const user = await User.findByPk(req.params.id, { include: { model: Role, as: 'role' } });
//   if (user) {
//     res.status(200).json(user);
//   } else {
//     res.status(404).json({ error: 'User not found' });
//   }
// }));

router.get('/data', asyncHandler(async (req, res) => {
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
      const user = await User.findOne({ where: { id: userId }, include: { model: Role, as: 'role' } });
      if (!user) {
        console.log('No user found');
        return res.status(404).json({ error: 'No user found' });
      }
      res.status(200).json(user);
      console.log('User found:', user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Error fetching user' });
    }
  });



}));

module.exports = router;
