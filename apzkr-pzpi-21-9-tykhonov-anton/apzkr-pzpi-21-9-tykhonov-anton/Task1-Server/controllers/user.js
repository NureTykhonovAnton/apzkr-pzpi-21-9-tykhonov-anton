const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Role = require('../models/role');
const { hashPassword, comparePassword, generateToken } = require('../middlewares/authMiddleware');
const {verifyToken} = require('../middlewares/authMiddleware');

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

router.get('/:id', verifyToken, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: { model: Role, as: 'role' } });
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
}));

// Новый эндпоинт для получения данных пользователя по токену
router.get('/data', verifyToken, asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
}));

module.exports = router;
