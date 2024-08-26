const express = require('express');
const router = express.Router();
const Zone = require('../models/zone');
const EmergencyType = require('../models/emergencyType'); // Ensure that you import EmergencyType if needed

/**
 * @module zoneRoutes
 */

/**
 * GET /api/zones - Fetch all zones with associated EmergencyType
 * 
 * @function
 * @name getZones
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @throws {Error} Throws error if fetching zones fails.
 * @returns {void}
 */
router.get('/', async (req, res) => {
  try {
    const zones = await Zone.findAll({
      include: [
        {
          model: EmergencyType,
          as: 'emergencyType', // Include the associated EmergencyType
        },
      ],
    });
    res.json(zones);
  } catch (error) {
    console.error('Error fetching zones:', error);
    res.status(500).json({ error: 'Error fetching zones' });
  }
});

/**
 * GET /api/zones/:id - Fetch a single zone by ID with associated EmergencyType
 * 
 * @function
 * @name getZoneById
 * @param {express.Request} req - The HTTP request object, containing the zone ID in `req.params`.
 * @param {express.Response} res - The HTTP response object.
 * @throws {Error} Throws error if fetching zone fails or zone is not found.
 * @returns {void}
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const zone = await Zone.findByPk(id, {
      include: [
        {
          model: EmergencyType,
          as: 'emergencyType', // Include the associated EmergencyType
        },
      ],
    });
    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    res.json(zone);
  } catch (error) {
    console.error('Error fetching zone:', error);
    res.status(500).json({ error: 'Error fetching zone' });
  }
});

/**
 * POST /api/zones - Create a new zone with emergencyTypeId
 * 
 * @function
 * @name createZone
 * @param {express.Request} req - The HTTP request object, containing zone details in `req.body`.
 * @param {express.Response} res - The HTTP response object.
 * @throws {Error} Throws error if creating zone fails or if invalid `emergencyTypeId` is provided.
 * @returns {void}
 */
router.post('/', async (req, res) => {
  const { name, longitude, latitude, radius, emergencyTypeId, startedAt, endedAt } = req.body;
  try {
    // Ensure the emergencyTypeId exists in the EmergencyType table
    const emergencyType = await EmergencyType.findByPk(emergencyTypeId);
    if (!emergencyType) {
      return res.status(400).json({ error: 'Invalid emergencyTypeId' });
    }

    const newZone = await Zone.create({ name, longitude, latitude, radius, emergencyTypeId, startedAt, endedAt });
    res.status(201).json(newZone);
  } catch (error) {
    console.error('Error creating zone:', error);
    res.status(500).json({ error: 'Error creating zone' });
  }
});

/**
 * PUT /api/zones/:id - Update a zone by ID with emergencyTypeId
 * 
 * @function
 * @name updateZoneById
 * @param {express.Request} req - The HTTP request object, containing the zone ID in `req.params` and updated zone details in `req.body`.
 * @param {express.Response} res - The HTTP response object.
 * @throws {Error} Throws error if updating zone fails, zone is not found, or if invalid `emergencyTypeId` is provided.
 * @returns {void}
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, longitude, latitude, radius, emergencyTypeId, startedAt, endedAt } = req.body;
  try {
    const zone = await Zone.findByPk(id);
    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }

    // Ensure the emergencyTypeId exists in the EmergencyType table
    if (emergencyTypeId) {
      const emergencyType = await EmergencyType.findByPk(emergencyTypeId);
      if (!emergencyType) {
        return res.status(400).json({ error: 'Invalid emergencyTypeId' });
      }
    }

    await zone.update({ name, longitude, latitude, radius, emergencyTypeId, startedAt, endedAt });
    res.json(zone);
  } catch (error) {
    console.error('Error updating zone:', error);
    res.status(500).json({ error: 'Error updating zone' });
  }
});

/**
 * DELETE /api/zones/:id - Delete a zone by ID
 * 
 * @function
 * @name deleteZoneById
 * @param {express.Request} req - The HTTP request object, containing the zone ID in `req.params`.
 * @param {express.Response} res - The HTTP response object.
 * @throws {Error} Throws error if deleting zone fails or zone is not found.
 * @returns {void}
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const zone = await Zone.findByPk(id);
    if (!zone) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    await zone.destroy();
    res.json({ message: 'Zone deleted successfully' });
  } catch (error) {
    console.error('Error deleting zone:', error);
    res.status(500).json({ error: 'Error deleting zone' });
  }
});

module.exports = router;
