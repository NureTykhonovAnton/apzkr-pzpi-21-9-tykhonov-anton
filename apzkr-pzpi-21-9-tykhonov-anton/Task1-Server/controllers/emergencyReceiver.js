const express = require('express');
const router = express.Router();
const EmergencyReceiver = require('../models/emergencyReceiver');
const User = require('../models/user');
const IoTDevice = require('../models/iotDevice');
const Emergency = require('../models/emergency');

// GET all emergency receivers
router.get('/', async (req, res) => {
  try {
    const emergencyReceivers = await EmergencyReceiver.findAll({
      include: [
        { model: User, as: 'userReceiver', required: false },
        { model: IoTDevice, as: 'deviceReceiver', required: false },
        { model: Emergency, as: 'emergency' }
      ]
    });
    res.json(emergencyReceivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET emergency receiver by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const emergencyReceiver = await EmergencyReceiver.findByPk(id, {
      include: [
        { model: User, as: 'userReceiver', required: false },
        { model: IoTDevice, as: 'deviceReceiver', required: false },
        { model: Emergency, as: 'emergency' }
      ]
    });
    if (!emergencyReceiver) {
      return res.status(404).json({ message: 'Emergency Receiver not found' });
    }
    res.json(emergencyReceiver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// CREATE a new emergency receiver
router.post('/', async (req, res) => {
  const { receiverType, receiverId, emergencyId } = req.body;
  try {
    const newEmergencyReceiver = await EmergencyReceiver.create({ receiverType, receiverId, emergencyId });
    res.status(201).json(newEmergencyReceiver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE emergency receiver by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { receiverType, receiverId, emergencyId } = req.body;
  try {
    let emergencyReceiver = await EmergencyReceiver.findByPk(id);
    if (!emergencyReceiver) {
      return res.status(404).json({ message: 'Emergency Receiver not found' });
    }
    emergencyReceiver.receiverType = receiverType;
    emergencyReceiver.receiverId = receiverId;
    emergencyReceiver.emergencyId = emergencyId;
    await emergencyReceiver.save();
    res.json(emergencyReceiver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE emergency receiver by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const emergencyReceiver = await EmergencyReceiver.findByPk(id);
    if (!emergencyReceiver) {
      return res.status(404).json({ message: 'Emergency Receiver not found' });
    }
    await emergencyReceiver.destroy();
    res.json({ message: 'Emergency Receiver deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
