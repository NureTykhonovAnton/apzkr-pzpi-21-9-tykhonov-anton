const express = require('express');
const router = express.Router();
const UserLocation = require('../models/userLocation');
const User = require('../models/user');

// GET /api/user-locations - Fetch all user locations
router.get('/', async (req, res) => {
  try {
    const userLocations = await UserLocation.findAll({include:{model: User, as:'user'}});
    res.json(userLocations);
  } catch (error) {
    console.error('Error fetching user locations:', error);
    res.status(500).json({ error: 'Error fetching user locations' });
  }
});

// GET /api/user-locations/:id - Fetch a single user location by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userLocation = await UserLocation.findByPk(id, {include:{model: User, as:'user'}});
    if (!userLocation) {
      return res.status(404).json({ error: 'User location not found' });
    }
    res.json(userLocation);
  } catch (error) {
    console.error('Error fetching user location:', error);
    res.status(500).json({ error: 'Error fetching user location' });
  }
});

// POST /api/user-locations - Create a new user location
router.post('/', async (req, res) => {
  const { userId, longitude, latitude } = req.body;
  try {
    const newUserLocation = await UserLocation.create({ userId, longitude, latitude });
    res.status(201).json(newUserLocation);
  } catch (error) {
    console.error('Error creating user location:', error);
    res.status(500).json({ error: 'Error creating user location' });
  }
});

// PUT /api/user-locations/:id - Update a user location by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { userId, longitude, latitude } = req.body;
  try {
    const userLocation = await UserLocation.findByPk(id);
    if (!userLocation) {
      return res.status(404).json({ error: 'User location not found' });
    }
    await userLocation.update({ userId, longitude, latitude });
    res.json(userLocation);
  } catch (error) {
    console.error('Error updating user location:', error);
    res.status(500).json({ error: 'Error updating user location' });
  }
});

// DELETE /api/user-locations/:id - Delete a user location by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const userLocation = await UserLocation.findByPk(id);
    if (!userLocation) {
      return res.status(404).json({ error: 'User location not found' });
    }
    await userLocation.destroy();
    res.json({ message: 'User location deleted successfully' });
  } catch (error) {
    console.error('Error deleting user location:', error);
    res.status(500).json({ error: 'Error deleting user location' });
  }
});

module.exports = router;
