const express = require('express');
const router = express.Router();
const  Zone  = require('../models/zone');

// GET /api/zones - Fetch all zones
router.get('/', async (req, res) => {
  try {
    const zones = await Zone.findAll();
    res.json(zones);
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({ error: 'Error fetching zones' });
  }
});

// GET /api/zones/:id - Fetch a single zone by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const zone = await Zone.findByPk(id);
    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    res.json(zone);
  } catch (error) {
    console.error('Error fetching zone:', error);
    res.status(500).json({ error: 'Error fetching zone' });
  }
});

// POST /api/zones - Create a new zone
router.post('/', async (req, res) => {
  const { name, longitude, latitude, radius } = req.body;
  try {
    const newZone = await Zone.create({ name, longitude, latitude, radius });
    res.status(201).json(newZone);
  } catch (error) {
    console.error('Error creating zone:', error);
    res.status(500).json({ error: 'Error creating zone' });
  }
});

// PUT /api/zones/:id - Update a zone by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, longitude, latitude, radius } = req.body;
  try {
    const zone = await Zone.findByPk(id);
    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    await zone.update({ name, longitude, latitude, radius });
    res.json(zone);
  } catch (error) {
    console.error('Error updating zone:', error);
    res.status(500).json({ error: 'Error updating zone' });
  }
});

// DELETE /api/zones/:id - Delete a zone by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const zone = await Zone.findByPk(id);
    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    await zone.destroy();
    res.json({ message: 'Zone deleted successfully' });
  } catch (error) {
    console.error('Error deleting zone:', error);
    res.status(500).json({ error: 'Error deleting zone' });
  }
});

module.exports = router;
