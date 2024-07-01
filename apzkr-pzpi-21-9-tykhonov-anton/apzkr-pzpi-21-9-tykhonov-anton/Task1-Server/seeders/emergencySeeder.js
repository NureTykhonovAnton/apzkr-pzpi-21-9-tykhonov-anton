const { DataTypes, BOOLEAN } = require('sequelize');
const sequelize = require('../config/database');
const Emergency = require('../models/emergency');
const EmergencyType = require('../models/emergencyType');

const seedEmergencies = async () => {
  try {
    // Example data for emergencies
    const emergencies = [
      {
        startedAt: new Date('2024-06-01T08:00:00Z'),
        endedAt: null, // Emergency ongoing
        hasEnded: false,
        typeId: 1, // Replace with an existing emergency type ID from your database
      },
      {
        startedAt: new Date('2024-05-15T12:00:00Z'),
        endedAt: new Date('2024-05-15T16:00:00Z'),
        hasEnded: true,
        typeId: 2, // Replace with another existing emergency type ID
      },
      // Add more emergency entries as needed
    ];

    // Sync the model with the database
    await Emergency.sync({ force: true });

    // Insert predefined emergencies
    await Emergency.bulkCreate(emergencies);

    console.log('Emergencies seeded successfully');
  } catch (error) {
    console.error('Error seeding Emergencies:', error);
  } finally {
    sequelize.close(); // Close the database connection
  }
};

seedEmergencies();
