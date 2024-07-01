const express = require('express');
const router = express.Router();
const EmergencyType = require('../models/emergencyType');

// GET all emergency types
router.get('/', async (req, res) => {
  try {
    const emergencyTypes = await EmergencyType.findAll();
    res.json(emergencyTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET emergency type by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const emergencyType = await EmergencyType.findByPk(id);
    if (!emergencyType) {
      return res.status(404).json({ message: 'Emergency Type not found' });
    }
    res.json(emergencyType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// CREATE a new emergency type
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newEmergencyType = await EmergencyType.create({ name, description });
    res.status(201).json(newEmergencyType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE emergency type by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    let emergencyType = await EmergencyType.findByPk(id);
    if (!emergencyType) {
      return res.status(404).json({ message: 'Emergency Type not found' });
    }
    emergencyType.name = name;
    emergencyType.description = description;
    await emergencyType.save();
    res.json(emergencyType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE emergency type by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const emergencyType = await EmergencyType.findByPk(id);
    if (!emergencyType) {
      return res.status(404).json({ message: 'Emergency Type not found' });
    }
    await emergencyType.destroy();
    res.json({ message: 'Emergency Type deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
