const express = require('express');
const router = express.Router();
const { EmergencyType } = require('../../models');

// Create a new Emergency Type
router.post('/', async (req, res) => {
  try {
    const emergencyType = await EmergencyType.create(req.body);
    res.status(201).json(emergencyType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Emergency Types
router.get('/', async (req, res) => {
  try {
    const emergencyTypes = await EmergencyType.findAll();
    res.status(200).json(emergencyTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Emergency Type by ID
router.get('/:id', async (req, res) => {
  try {
    const emergencyType = await EmergencyType.findByPk(req.params.id);
    if (emergencyType) {
      res.status(200).json(emergencyType);
    } else {
      res.status(404).json({ error: 'Emergency Type not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Emergency Type
router.put('/:id', async (req, res) => {
  try {
    const emergencyType = await EmergencyType.findByPk(req.params.id);
    if (emergencyType) {
      await emergencyType.update(req.body);
      res.status(200).json(emergencyType);
    } else {
      res.status(404).json({ error: 'Emergency Type not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Emergency Type
router.delete('/:id', async (req, res) => {
  try {
    const emergencyType = await EmergencyType.findByPk(req.params.id);
    if (emergencyType) {
      await emergencyType.destroy();
      res.status(200).json({ message: 'Emergency Type deleted' });
    } else {
      res.status(404).json({ error: 'Emergency Type not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
