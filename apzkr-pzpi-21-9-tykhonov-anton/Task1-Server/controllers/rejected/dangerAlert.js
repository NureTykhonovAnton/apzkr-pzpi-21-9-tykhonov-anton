const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const DangerAlert = require('../models/dangerAlert'); // Adjust the import path as necessary

// Create a new Danger Alert
router.post('/', asyncHandler(async (req, res) => {
  const { alertId, deviceId, alertType, alertLevel } = req.body;
  const newAlert = await DangerAlert.create({
    alertId,
    deviceId,
    alertType,
    alertLevel,
  });
  res.status(201).json(newAlert);
}));

// Get all Danger Alerts
router.get('/', asyncHandler(async (req, res) => {
  const alerts = await DangerAlert.findAll();
  res.status(200).json(alerts);
}));

// Get Danger Alert by ID
router.get('/:alertId', asyncHandler(async (req, res) => {
  const alert = await DangerAlert.findByPk(req.params.alertId);
  if (alert) {
    res.status(200).json(alert);
  } else {
    res.status(404).json({ error: 'Danger Alert not found' });
  }
}));

// Update Danger Alert
router.put('/:alertId', asyncHandler(async (req, res) => {
  const alert = await DangerAlert.findByPk(req.params.alertId);
  if (alert) {
    const { deviceId, alertType, alertLevel } = req.body;
    await alert.update({
      deviceId,
      alertType,
      alertLevel,
    });
    res.status(200).json(alert);
  } else {
    res.status(404).json({ error: 'Danger Alert not found' });
  }
}));

// Delete Danger Alert
router.delete('/:alertId', asyncHandler(async (req, res) => {
  const alert = await DangerAlert.findByPk(req.params.alertId);
  if (alert) {
    await alert.destroy();
    res.status(200).json({ message: 'Danger Alert deleted' });
  } else {
    res.status(404).json({ error: 'Danger Alert not found' });
  }
}));

module.exports = router;
