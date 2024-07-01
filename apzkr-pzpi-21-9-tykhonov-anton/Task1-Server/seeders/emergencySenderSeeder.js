const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const EmergencySender = require('../models/emergencySender');
const User = require('../models/user');
const IoTDevice = require('../models/iotDevice');

const seedEmergencySenders = async () => {
  try {
    // Example data for emergency senders
    const emergencySenders = [
      {
        senderType: 'user',
        senderId: 1, // Replace with an existing user ID from your database
        emergencyId: 1, // Replace with an existing emergency ID
      },
      {
        senderType: 'iotDevice',
        senderId: 1, // Replace with an existing IoT device ID from your database
        emergencyId: 2, // Replace with an existing emergency ID
      },
      // Add more emergency sender entries as needed
    ];

    // Sync the model with the database
    await EmergencySender.sync({ force: true });

    // Insert predefined emergency senders
    await EmergencySender.bulkCreate(emergencySenders);

    console.log('Emergency senders seeded successfully');
  } catch (error) {
    console.error('Error seeding Emergency senders:', error);
  } finally {
    sequelize.close(); // Close the database connection
  }
};

seedEmergencySenders();
