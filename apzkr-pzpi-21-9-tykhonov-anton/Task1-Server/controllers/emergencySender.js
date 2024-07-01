const express = require('express');
const router = express.Router();
const EmergencySender = require('../models/emergencySender');
const User = require('../models/user');
const IoTDevice = require('../models/iotDevice');
const Emergency = require('../models/emergency');

// GET all emergency senders
router.get('/', async (req, res) => {
  try {
    const emergencySenders = await EmergencySender.findAll({
      include: [
        { model: User, as: 'userSender', required: false },
        { model: IoTDevice, as: 'deviceSender', required: false },
        { model: Emergency, as: 'emergency' }
      ]
    });
    res.json(emergencySenders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET emergency sender by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const emergencySender = await EmergencySender.findByPk(id, {
      include: [
        { model: User, as: 'userSender', required: false },
        { model: IoTDevice, as: 'deviceSender', required: false },
        { model: Emergency, as: 'emergency' }
      ]
    });
    if (!emergencySender) {
      return res.status(404).json({ message: 'Emergency Sender not found' });
    }
    res.json(emergencySender);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// CREATE a new emergency sender
router.post('/', async (req, res) => {
  const { senderType, senderId, emergencyId } = req.body;
  try {
    const newEmergencySender = await EmergencySender.create({ senderType, senderId, emergencyId });
    res.status(201).json(newEmergencySender);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE emergency sender by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { senderType, senderId, emergencyId } = req.body;
  try {
    let emergencySender = await EmergencySender.findByPk(id);
    if (!emergencySender) {
      return res.status(404).json({ message: 'Emergency Sender not found' });
    }
    emergencySender.senderType = senderType;
    emergencySender.senderId = senderId;
    emergencySender.emergencyId = emergencyId;
    await emergencySender.save();
    res.json(emergencySender);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE emergency sender by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const emergencySender = await EmergencySender.findByPk(id);
    if (!emergencySender) {
      return res.status(404).json({ message: 'Emergency Sender not found' });
    }
    await emergencySender.destroy();
    res.json({ message: 'Emergency Sender deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
