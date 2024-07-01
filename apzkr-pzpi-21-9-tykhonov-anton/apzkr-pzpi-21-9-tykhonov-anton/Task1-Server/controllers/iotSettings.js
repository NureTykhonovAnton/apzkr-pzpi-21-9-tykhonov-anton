// controllers/iotSettingsController.js

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const IoTSettings = require('../models/iotSettings');

// Fetch all IoTSettings
router.get('/', asyncHandler(async (req, res) => {
  const settings = await IoTSettings.findAll();
  res.status(200).json(settings);
}));

// Create a new IoTSetting
router.post('/', asyncHandler(async (req, res) => {
  const { name, value } = req.body;

  try {
    const newSetting = await IoTSettings.create({
      name,
      value,
    });
    res.status(201).json(newSetting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

// Update an existing IoTSetting
router.put('/:id', asyncHandler(async (req, res) => {
  const { name, value } = req.body;
  const settingId = req.params.id;

  try {
    const setting = await IoTSettings.findByPk(settingId);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    await setting.update({
      name,
      value,
    });

    res.status(200).json(setting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

// Delete an existing IoTSetting
router.delete('/:id', asyncHandler(async (req, res) => {
  const settingId = req.params.id;

  try {
    const setting = await IoTSettings.findByPk(settingId);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    await setting.destroy();
    res.status(200).json({ message: 'Setting deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}));

module.exports = router;
