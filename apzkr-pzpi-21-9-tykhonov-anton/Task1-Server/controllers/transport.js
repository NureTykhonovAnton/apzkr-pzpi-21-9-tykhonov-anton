const express = require('express');
const router = express.Router();
const Transport = require('../models/transport');
const TransportType = require('../models/transportType');
const User = require('../models/user');

// GET all transports
router.get('/', async (req, res) => {
  try {
    const transports = await Transport.findAll({
      include: [
        { model: TransportType, as: 'type' },
        { model: User, as: 'driver' }
      ]
    });
    res.json(transports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET transport by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const transport = await Transport.findByPk(id, {
      include: [
        { model: TransportType, as: 'type' },
        { model: User, as: 'driver' }
      ]
    });
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    res.json(transport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//GET Transport by User ID

router.get('users/:id', async (req, res) => {
  const { userId } = req.params;

  try {
    const transports = await Transport.findAll({
      where: { driverId: userId },
      include: [
        { model: User, as: 'driver' }
      ]
    });

    if (!transports) {
      return res.status(404).json({ message: 'Transports not found' });
    }

    res.status(200).json(transports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
})

// CREATE a new transport
router.post('/', async (req, res) => {
  const { model, typeId, capacity, driverId, licencePlate, img } = req.body;
  try {
    const newTransport = await Transport.create({ model, typeId, capacity, driverId, licencePlate, img });
    res.status(201).json(newTransport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE transport by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { model, typeId, capacity, driverId, licencePlate, img } = req.body;
  try {
    let transport = await Transport.findByPk(id);
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    transport.model = model;
    transport.typeId = typeId;
    transport.capacity = capacity;
    transport.driverId = driverId;
    transport.licencePlate = licencePlate;
    transport.img = img;
    await transport.save();
    res.json(transport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE transport by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const transport = await Transport.findByPk(id);
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    await transport.destroy();
    res.json({ message: 'Transport deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
