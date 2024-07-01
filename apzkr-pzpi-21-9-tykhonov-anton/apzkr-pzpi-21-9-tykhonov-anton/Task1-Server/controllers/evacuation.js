const express = require('express');
const router = express.Router();
const Evacuation = require('../models/evacuation');
const Zone = require('../models/zone');
const Center = require('../models/center');
const Emergency = require('../models/emergency');

// GET all evacuations
router.get('/', async (req, res) => {
  try {
    const evacuations = await Evacuation.findAll({
      include: [
        { model: Zone, as: 'startZone' },
        { model: Center, as: 'endCenter' },
        { model: Emergency, as: 'emergency' }
      ]
    });
    res.json(evacuations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET evacuation by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const evacuation = await Evacuation.findByPk(id, {
      include: [
        { model: Zone, as: 'startZone' },
        { model: Center, as: 'endCenter' },
        { model: Emergency, as: 'emergency' }
      ]
    });
    if (!evacuation) {
      return res.status(404).json({ message: 'Evacuation not found' });
    }
    res.json(evacuation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// CREATE a new evacuation
router.post('/', async (req, res) => {
  const { zoneStart, centerEnd, emergencyId } = req.body;
  try {
    const newEvacuation = await Evacuation.create({ zoneStart, centerEnd, emergencyId });
    res.status(201).json(newEvacuation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE evacuation by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { zoneStart, centerEnd, emergencyId } = req.body;
  try {
    let evacuation = await Evacuation.findByPk(id);
    if (!evacuation) {
      return res.status(404).json({ message: 'Evacuation not found' });
    }
    evacuation.zoneStart = zoneStart;
    evacuation.centerEnd = centerEnd;
    evacuation.emergencyId = emergencyId;
    await evacuation.save();
    res.json(evacuation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE evacuation by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const evacuation = await Evacuation.findByPk(id);
    if (!evacuation) {
      return res.status(404).json({ message: 'Evacuation not found' });
    }
    await evacuation.destroy();
    res.json({ message: 'Evacuation deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
