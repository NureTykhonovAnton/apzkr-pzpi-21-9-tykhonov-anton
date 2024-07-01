const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const EmergencyType = require('../models/emergencyType');

const seedEmergencyTypes = async () => {
  try {
    // Predefined emergency types
    const emergencyTypes = [
      {
        name: 'Fire',
        description: 'Emergency caused by fire outbreak.',
      },
      {
        name: 'Flood',
        description: 'Emergency caused by flooding.',
      },
      {
        name: 'Earthquake',
        description: 'Emergency caused by seismic activity.',
      },
      // Add more emergency types as needed
    ];

    // Sync the model with the database
    await EmergencyType.sync({ force: true });

    // Insert predefined emergency types
    await EmergencyType.bulkCreate(emergencyTypes);

    console.log('Emergency types seeded successfully');
  } catch (error) {
    console.error('Error seeding Emergency types:', error);
  } finally {
    sequelize.close(); // Close the database connection
  }
};

seedEmergencyTypes();
