const express = require('express');
const router = express.Router();
const Evacuation = require('../models/evacuation');
const Zone = require('../models/zone');
const Center = require('../models/center');
const User = require('../models/user');

/**
 * @route GET /evacuations
 * @desc Retrieve all evacuations, including related start zones, end centers, and users
 * @access Public
 * @returns {Object[]} Array of evacuation objects with related models
 * @throws {500} Server Error
 */
router.get('/', async (req, res) => {
  try {
    const evacuations = await Evacuation.findAll({
      include: [
        { model: Zone, as: 'startZone' },
        { model: Center, as: 'endCenter' },
        { model: User, as: 'user' }
      ]
    });
    res.json(evacuations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route GET /evacuations/:userId
 * @desc Retrieve an evacuation by User ID, including related start zone, end center, and user
 * @param {string} userId - The ID of the user whose evacuation is to be retrieved
 * @access Public
 * @returns {Object} Evacuation object with related models
 * @throws {404} Not Found - Evacuation not found
 * @throws {500} Server Error
 */
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const evacuation = await Evacuation.findOne({
      where: { userId },
      include: [
        { model: Zone, as: 'startZone' },
        { model: Center, as: 'endCenter' },
        { model: User, as: 'user' }
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

/**
 * @route POST /evacuations
 * @desc Create a new evacuation
 * @param {Object} req.body - Data for the new evacuation
 * @param {number} req.body.startZoneId - The ID of the start zone
 * @param {number} req.body.endCenterId - The ID of the end center
 * @param {number} req.body.userId - The ID of the user associated with the evacuation
 * @access Public
 * @returns {Object} Newly created evacuation object
 * @throws {500} Server Error
 */
router.post('/', async (req, res) => {
  const { startZoneId, endCenterId, userId } = req.body;
  try {
    const newEvacuation = await Evacuation.create({ startZoneId, endCenterId, userId });
    res.status(201).json(newEvacuation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route PUT /evacuations/:id
 * @desc Update an evacuation by its ID
 * @param {string} id - The ID of the evacuation to update
 * @param {Object} req.body - Updated data for the evacuation
 * @param {number} req.body.startZoneId - The updated ID of the start zone
 * @param {number} req.body.endCenterId - The updated ID of the end center
 * @param {number} req.body.userId - The updated ID of the user
 * @access Public
 * @returns {Object} Updated evacuation object
 * @throws {404} Not Found - Evacuation not found
 * @throws {500} Server Error
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { startZoneId, endCenterId, userId } = req.body;
  try {
    let evacuation = await Evacuation.findByPk(id);
    if (!evacuation) {
      return res.status(404).json({ message: 'Evacuation not found' });
    }
    evacuation.startZoneId = startZoneId;
    evacuation.endCenterId = endCenterId;
    evacuation.userId = userId;
    await evacuation.save();
    res.json(evacuation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

/**
 * @route DELETE /evacuations/:id
 * @desc Delete an evacuation by its ID
 * @param {string} id - The ID of the evacuation to delete
 * @access Public
 * @returns {Object} Success message
 * @throws {404} Not Found - Evacuation not found
 * @throws {500} Server Error
 */
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
