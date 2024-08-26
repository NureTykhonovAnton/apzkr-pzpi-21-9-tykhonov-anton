const express = require('express');
const router = express.Router();
const IoTDevice = require('../models/iotDevice');

/**
 * @module iotDEvice
 */

/**
 * @route GET /iot-devices
 * @desc Retrieve all IoT devices
 * @access Public
 * @returns {Object[]} Array of IoT device objects
 * @throws {500} Server Error
 */
router.get('/', async (req, res) => {
  try {
    const devices = await IoTDevice.findAll();
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route GET /iot-devices/:id
 * @desc Retrieve an IoT device by its ID
 * @param {string} id - The ID of the IoT device to retrieve
 * @access Public
 * @returns {Object} IoT device object
 * @throws {404} Not Found - Device not found
 * @throws {500} Server Error
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const device = await IoTDevice.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route POST /iot-devices
 * @desc Create a new IoT device
 * @param {Object} req.body - Data for the new IoT device
 * @param {string} req.body.MACADDR - The MAC address of the device
 * @param {number} req.body.defaultZoneRaduis - The default zone radius for the device
 * @param {number} req.body.gasLimit - The gas limit for the device
 * @param {number} req.body.longitude - The longitude of the device location
 * @param {number} req.body.latitude - The latitude of the device location
 * @access Public
 * @returns {Object} Newly created IoT device object
 * @throws {500} Server Error
 */
router.post('/', async (req, res) => {
  const { MACADDR, defaultZoneRaduis, gasLimit, longitude, latitude } = req.body;
  try {
    const newDevice = await IoTDevice.create({
      MACADDR,
      defaultZoneRaduis,
      gasLimit,
      longitude,
      latitude
    });
    res.status(201).json(newDevice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route PUT /iot-devices/:id
 * @desc Update an IoT device by its ID
 * @param {string} id - The ID of the IoT device to update
 * @param {Object} req.body - Updated data for the IoT device
 * @param {string} req.body.MACADDR - The updated MAC address of the device
 * @param {number} req.body.defaultZoneRaduis - The updated default zone radius for the device
 * @param {number} req.body.gasLimit - The updated gas limit for the device
 * @param {number} req.body.longitude - The updated longitude of the device location
 * @param {number} req.body.latitude - The updated latitude of the device location
 * @access Public
 * @returns {Object} Updated IoT device object
 * @throws {404} Not Found - Device not found
 * @throws {500} Server Error
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { MACADDR, defaultZoneRaduis, gasLimit, longitude, latitude } = req.body;
  try {
    let device = await IoTDevice.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.MACADDR = MACADDR;
    device.defaultZoneRaduis = defaultZoneRaduis;
    device.gasLimit = gasLimit;
    device.longitude = longitude;
    device.latitude = latitude;

    await device.save();
    res.json(device);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route DELETE /iot-devices/:id
 * @desc Delete an IoT device by its ID
 * @param {string} id - The ID of the IoT device to delete
 * @access Public
 * @returns {Object} Success message
 * @throws {404} Not Found - Device not found
 * @throws {500} Server Error
 */
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
