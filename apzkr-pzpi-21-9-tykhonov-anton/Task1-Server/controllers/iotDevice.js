const express = require('express');
const router = express.Router();
const IoTDevice = require('../models/iotDevice');
const IoTSettings = require('../models/iotSettings'); // Import IoTSettings model

// GET all IoT devices with associated settings
router.get('/', async (req, res) => {
  try {
    const devices = await IoTDevice.findAll({
      include:{model: IoTSettings, as: 'settings'} , // Include IoTSettings model
    });
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET IoT device by ID with associated settings
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const device = await IoTDevice.findByPk(id, {
      include: {model: IoTSettings, as: 'settings'}
    });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// CREATE a new IoT device with settings
router.post('/', async (req, res) => {
  const { MACADDR, settingsId, longitude, latitude } = req.body;
  try {
    // Validate settingsId against existing IoTSettings
    const existingSetting = await IoTSettings.findByPk(settingsId);
    if (!existingSetting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    const newDevice = await IoTDevice.create({ MACADDR, settingsId, longitude, latitude });
    res.status(201).json(newDevice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// UPDATE IoT device by ID with settings
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { MACADDR, settingsId, longitude, latitude } = req.body;
  try {
    let device = await IoTDevice.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Validate settingsId against existing IoTSettings
    const existingSetting = await IoTSettings.findByPk(settingsId);
    if (!existingSetting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    device.MACADDR = MACADDR;
    device.settingsId = settingsId;
    device.longitude = longitude;
    device.latitude = latitude;
    await device.save();
    res.json(device);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// DELETE IoT device by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const device = await IoTDevice.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    await device.destroy();
    res.json({ message: 'Device deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
