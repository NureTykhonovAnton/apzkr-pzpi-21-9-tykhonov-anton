const { sequelize } = require('./config/database');
const { UserLocation } = require('../models/userLocation'); // Adjust path as needed

async function seedUserLocation() {
  const sampleLocations = [
    {
      userId: 1, // Ensure these userId values exist in your User table
      longitude: 13.4050,
      latitude: 52.5200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: 2, // Ensure these userId values exist in your User table
      longitude: -0.1276,
      latitude: 51.5074,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Add more sample data as needed
  ];

  try {
    await UserLocation.bulkCreate(sampleLocations);
    console.log('UserLocation table seeded successfully.');
  } catch (error) {
    console.error('Error seeding UserLocation table:', error);
  } finally {
    await sequelize.close();
  }
}

seedUserLocation();