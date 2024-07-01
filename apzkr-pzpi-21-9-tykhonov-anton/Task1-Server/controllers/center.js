const express = require('express');
const router = express.Router();
const Center = require('../models/center');

// GET all centers
router.get('/', async (req, res) => {
  try {
    const centers = await Center.findAll();
    res.json(centers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET center by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const center = await Center.findByPk(id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    res.json(center);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// CREATE a new center
router.post('/', async (req, res) => {
  const { name, longitude, latitude } = req.body;
  try {
    const newCenter = await Center.create({ name, longitude, latitude });
    res.status(201).json(newCenter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE center by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, longitude, latitude } = req.body;
  try {
    let center = await Center.findByPk(id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    center.name = name;
    center.longitude = longitude;
    center.latitude = latitude;
    await center.save();
    res.json(center);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE center by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const center = await Center.findByPk(id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    await center.destroy();
    res.json({ message: 'Center deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
