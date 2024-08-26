const express = require('express');
const router = express.Router();
const EmergencyType = require('../models/emergencyType');
/**
 * @module emergencyTypes
 */

/**
 * @route GET /emergency-types
 * @desc Retrieve all emergency types
 * @access Public
 * @returns {Object[]} Array of emergency type objects
 * @throws {500} Server Error
 */
router.get('/', async (req, res) => {
  try {
    const emergencyTypes = await EmergencyType.findAll();
    res.json(emergencyTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route GET /emergency-types/:id
 * @desc Retrieve an emergency type by its ID
 * @param {string} id - The ID of the emergency type to retrieve
 * @access Public
 * @returns {Object} Emergency type object
 * @throws {404} Not Found - Emergency Type not found
 * @throws {500} Server Error
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const emergencyType = await EmergencyType.findByPk(id);
    if (!emergencyType) {
      return res.status(404).json({ message: 'Emergency Type not found' });
    }
    res.json(emergencyType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route POST /emergency-types
 * @desc Create a new emergency type
 * @param {Object} req.body - Emergency type data
 * @param {string} req.body.name - Name of the emergency type
 * @param {string} req.body.description - Description of the emergency type
 * @access Public
 * @returns {Object} Newly created emergency type object
 * @throws {500} Server Error
 */
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newEmergencyType = await EmergencyType.create({ name, description });
    res.status(201).json(newEmergencyType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route PUT /emergency-types/:id
 * @desc Update an emergency type by its ID
 * @param {string} id - The ID of the emergency type to update
 * @param {Object} req.body - Updated emergency type data
 * @param {string} req.body.name - Updated name of the emergency type
 * @param {string} req.body.description - Updated description of the emergency type
 * @access Public
 * @returns {Object} Updated emergency type object
 * @throws {404} Not Found - Emergency Type not found
 * @throws {500} Server Error
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    let emergencyType = await EmergencyType.findByPk(id);
    if (!emergencyType) {
      return res.status(404).json({ message: 'Emergency Type not found' });
    }
    emergencyType.name = name;
    emergencyType.description = description;
    await emergencyType.save();
    res.json(emergencyType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route DELETE /emergency-types/:id
 * @desc Delete an emergency type by its ID
 * @param {string} id - The ID of the emergency type to delete
 * @access Public
 * @returns {Object} Success message
 * @throws {404} Not Found - Emergency Type not found
 * @throws {500} Server Error
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const emergencyType = await EmergencyType.findByPk(id);
    if (!emergencyType) {
      return res.status(404).json({ message: 'Emergency Type not found' });
    }
    await emergencyType.destroy();
    res.json({ message: 'Emergency Type deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
