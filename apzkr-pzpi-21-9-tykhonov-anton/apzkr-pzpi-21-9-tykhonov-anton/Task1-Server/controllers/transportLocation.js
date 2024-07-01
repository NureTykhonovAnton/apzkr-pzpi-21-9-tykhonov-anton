const express = require('express');
const router = express.Router();
const TransportLocation = require('../models/transportLocation')
const Transport = require('../models/transport')

// GET /api/transport-locations - Получить все местоположения транспорта
router.get('/', async (req, res) => {
  try {
    const transportLocations = await TransportLocation.findAll({
      include: { model: Transport, as: 'transport' } // Включаем связанную модель Transport
    });
    res.json(transportLocations);
  } catch (error) {
    console.error('Error fetching transport locations:', error);
    res.status(500).json({ error: 'Error fetching transport locations' });
  }
});

// GET /api/transport-locations/:id - Получить местоположение транспорта по ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const transportLocation = await TransportLocation.findByPk(id, {
      include: { model: Transport, as: 'transport' } // Включаем связанную модель Transport
    });
    if (!transportLocation) {
      return res.status(404).json({ error: 'Transport location not found' });
    }
    res.json(transportLocation);
  } catch (error) {
    console.error('Error fetching transport location:', error);
    res.status(500).json({ error: 'Error fetching transport location' });
  }
});

// POST /api/transport-locations - Создать новое местоположение транспорта
router.post('/', async (req, res) => {
  const { transportId, longitude, latitude } = req.body;
  try {
    const newTransportLocation = await TransportLocation.create({
      transportId,
      longitude,
      latitude,
    });
    res.status(201).json(newTransportLocation);
  } catch (error) {
    console.error('Error creating transport location:', error);
    res.status(500).json({ error: 'Error creating transport location' });
  }
});

// PUT /api/transport-locations/:id - Обновить местоположение транспорта по ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { transportId, longitude, latitude } = req.body;
  try {
    const transportLocation = await TransportLocation.findByPk(id);
    if (!transportLocation) {
      return res.status(404).json({ error: 'Transport location not found' });
    }
    await transportLocation.update({
      transportId,
      longitude,
      latitude,
    });
    res.json(transportLocation);
  } catch (error) {
    console.error('Error updating transport location:', error);
    res.status(500).json({ error: 'Error updating transport location' });
  }
});

// DELETE /api/transport-locations/:id - Удалить местоположение транспорта по ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const transportLocation = await TransportLocation.findByPk(id);
    if (!transportLocation) {
      return res.status(404).json({ error: 'Transport location not found' });
    }
    await transportLocation.destroy();
    res.json({ message: 'Transport location deleted successfully' });
  } catch (error) {
    console.error('Error deleting transport location:', error);
    res.status(500).json({ error: 'Error deleting transport location' });
  }
});

module.exports = router;
