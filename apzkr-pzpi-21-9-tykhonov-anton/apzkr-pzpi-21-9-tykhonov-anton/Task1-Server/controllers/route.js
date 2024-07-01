const express = require('express');
const router = express.Router();
const Route = require('../models/route');
const Evacuation = require('../models/evacuation');
const Transport = require('../models/transport');

// GET all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.findAll({
      include: [
        { model: Evacuation, as: 'evacuation' },
        { model: Transport, as: 'transport' }
      ]
    });
    res.json(routes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET route by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const route = await Route.findByPk(id, {
      include: [
        { model: Evacuation, as: 'evacuation' },
        { model: Transport, as: 'transport' }
      ]
    });
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// CREATE a new route
router.post('/', async (req, res) => {
  const { transportId, evacuationId } = req.body;
  try {
    const newRoute = await Route.create({ transportId, evacuationId });
    res.status(201).json(newRoute);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE route by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { transportId, evacuationId } = req.body;
  try {
    let route = await Route.findByPk(id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    route.transportId = transportId;
    route.evacuationId = evacuationId;
    await route.save();
    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE route by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const route = await Route.findByPk(id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    await route.destroy();
    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
