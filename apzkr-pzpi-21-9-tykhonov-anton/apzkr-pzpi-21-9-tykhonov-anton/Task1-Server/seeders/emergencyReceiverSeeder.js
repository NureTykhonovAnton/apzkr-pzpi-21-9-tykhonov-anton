const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const EmergencyReceiver = require('../models/emergencyReceiver');
const User = require('../models/user');
const IoTDevice = require('../models/iotDevice');

const seedEmergencyReceivers = async () => {
  try {
    // Example data for emergency receivers
    const emergencyReceivers = [
      {
        receiverType: 'user',
        receiverId: 1, // Replace with an existing user ID from your database
        emergencyId: 1, // Replace with an existing emergency ID
      },
      {
        receiverType: 'iotDevice',
        receiverId: 1, // Replace with an existing IoT device ID from your database
        emergencyId: 2, // Replace with an existing emergency ID
      },
      // Add more emergency receiver entries as needed
    ];

    // Sync the model with the database
    await EmergencyReceiver.sync({ force: true });

    // Insert predefined emergency receivers
    await EmergencyReceiver.bulkCreate(emergencyReceivers);

    console.log('Emergency receivers seeded successfully');
  } catch (error) {
    console.error('Error seeding Emergency receivers:', error);
  } finally {
    sequelize.close(); // Close the database connection
  }
};

seedEmergencyReceivers();
