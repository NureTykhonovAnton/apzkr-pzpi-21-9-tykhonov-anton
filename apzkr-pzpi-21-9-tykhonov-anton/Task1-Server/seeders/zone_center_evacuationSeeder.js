const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Zone = require('../models/zone');
const Center = require('../models/center');
const Evacuation = require('../models/evacuation');

const seedDatabase = async () => {
  try {
    // Define your data for each model
    const zones = [
      { name: 'Zone A', longitude: 45.1234, latitude: 12.3456, radius: 500 },
      { name: 'Zone B', longitude: 46.789, latitude: 11.234, radius: 700 },
      // Add more zones as needed
    ];

    const centers = [
      { name: 'Center A', longitude: 37.7749, latitude: -122.4194 },
      { name: 'Center B', longitude: 40.7128, latitude: -74.0060 },
      // Add more centers as needed
    ];

    const evacuations = [
      { ZoneStart: 1, CenterEnd: 1 }, // Replace with actual IDs
      { ZoneStart: 2, CenterEnd: 2 }, // Replace with actual IDs
      // Add more evacuations as needed
    ];

    // Sync or seed zones first
    await Zone.sync({ force: true });
    await Zone.bulkCreate(zones);
    console.log('Zones seeded successfully');

    // Sync or seed centers next
    await Center.sync({ force: true });
    await Center.bulkCreate(centers);
    console.log('Centers seeded successfully');

    // Sync or seed evacuations last
    await Evacuation.sync({ force: true });
    await Evacuation.bulkCreate(evacuations);
    console.log('Evacuations seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    sequelize.close(); // Close the database connection after seeding
  }
};

seedDatabase();
