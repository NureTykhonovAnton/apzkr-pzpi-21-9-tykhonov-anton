const express = require('express');
const router = express.Router();
const Emergency = require('../models/emergency');
const EmergencyType = require('../models/emergencyType');

// GET all emergencies
router.get('/', async (req, res) => {
  try {
    const emergencies = await Emergency.findAll({
      include: [{ model: EmergencyType, as: 'emergencyType' }]
    });
    res.json(emergencies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET emergency by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const emergency = await Emergency.findByPk(id, {
      include: [{ model: EmergencyType, as: 'emergencyType' }]
    });
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }
    res.json(emergency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// CREATE a new emergency
router.post('/', async (req, res) => {
  const { startedAt, endedAt, hasEnded, type, emergencyTypeId } = req.body;
  try {
    const newEmergency = await Emergency.create({ startedAt, endedAt, hasEnded, type, emergencyTypeId });
    res.status(201).json(newEmergency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE emergency by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { startedAt, endedAt, hasEnded, type, emergencyTypeId } = req.body;
  try {
    let emergency = await Emergency.findByPk(id);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }
    emergency.startedAt = startedAt;
    emergency.endedAt = endedAt;
    emergency.hasEnded = hasEnded;
    emergency.type = type;
    emergency.emergencyTypeId = emergencyTypeId;
    await emergency.save();
    res.json(emergency);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE emergency by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const emergency = await Emergency.findByPk(id);
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }
    await emergency.destroy();
    res.json({ message: 'Emergency deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
