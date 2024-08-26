const express = require('express');
const router = express.Router();
const Center = require('../models/center');
/**
 * @module center
 */

/**
 * @route GET /centers
 * @desc Retrieve all centers
 * @access Public
 * @returns {Object[]} Array of center objects
 * @throws {500} Server Error
 */
router.get('/', async (req, res) => {
  try {
    const centers = await Center.findAll();
    res.json(centers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route GET /centers/:id
 * @desc Retrieve a center by its ID
 * @param {string} id - The ID of the center to retrieve
 * @access Public
 * @returns {Object} Center object
 * @throws {404} Not Found - Center not found
 * @throws {500} Server Error
 */
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

/**
 * @route POST /centers
 * @desc Create a new center
 * @param {Object} req.body - Center data
 * @param {string} req.body.name - Name of the center
 * @param {number} req.body.longitude - Longitude of the center
 * @param {number} req.body.latitude - Latitude of the center
 * @access Public
 * @returns {Object} Newly created center object
 * @throws {500} Server Error
 */
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

/**
 * @route PUT /centers/:id
 * @desc Update a center by its ID
 * @param {string} id - The ID of the center to update
 * @param {Object} req.body - Updated center data
 * @param {string} req.body.name - Updated name of the center
 * @param {number} req.body.longitude - Updated longitude of the center
 * @param {number} req.body.latitude - Updated latitude of the center
 * @access Public
 * @returns {Object} Updated center object
 * @throws {404} Not Found - Center not found
 * @throws {500} Server Error
 */
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

/**
 * @route DELETE /centers/:id
 * @desc Delete a center by its ID
 * @param {string} id - The ID of the center to delete
 * @access Public
 * @returns {Object} Success message
 * @throws {404} Not Found - Center not found
 * @throws {500} Server Error
 */
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
