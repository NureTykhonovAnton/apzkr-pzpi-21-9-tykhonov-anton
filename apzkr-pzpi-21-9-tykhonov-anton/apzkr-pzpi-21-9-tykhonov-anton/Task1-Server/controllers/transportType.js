const express = require('express');
const router = express.Router();
const TransportType  = require('../models/transportType'); // Assuming you have imported the TransportType model

// GET /api/transport-types - Fetch all transport types
router.get('/', async (req, res) => {
  try {
    const transportTypes = await TransportType.findAll();
    res.json(transportTypes);
  } catch (error) {
    console.error('Error fetching transport types:', error);
    res.status(500).json({ error: 'Error fetching transport types' });
  }
});

// GET /api/transport-types/:id - Fetch a single transport type by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const transportType = await TransportType.findByPk(id);
    if (!transportType) {
      return res.status(404).json({ error: 'Transport type not found' });
    }
    res.json(transportType);
  } catch (error) {
    console.error('Error fetching transport type:', error);
    res.status(500).json({ error: 'Error fetching transport type' });
  }
});

// POST /api/transport-types - Create a new transport type
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const newTransportType = await TransportType.create({ name });
    res.status(201).json(newTransportType);
  } catch (error) {
    console.error('Error creating transport type:', error);
    res.status(500).json({ error: 'Error creating transport type' });
  }
});

// PUT /api/transport-types/:id - Update a transport type by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const transportType = await TransportType.findByPk(id);
    if (!transportType) {
      return res.status(404).json({ error: 'Transport type not found' });
    }
    await transportType.update({ name });
    res.json(transportType);
  } catch (error) {
    console.error('Error updating transport type:', error);
    res.status(500).json({ error: 'Error updating transport type' });
  }
});

// DELETE /api/transport-types/:id - Delete a transport type by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const transportType = await TransportType.findByPk(id);
    if (!transportType) {
      return res.status(404).json({ error: 'Transport type not found' });
    }
    await transportType.destroy();
    res.json({ message: 'Transport type deleted successfully' });
  } catch (error) {
    console.error('Error deleting transport type:', error);
    res.status(500).json({ error: 'Error deleting transport type' });
  }
});

module.exports = router;
