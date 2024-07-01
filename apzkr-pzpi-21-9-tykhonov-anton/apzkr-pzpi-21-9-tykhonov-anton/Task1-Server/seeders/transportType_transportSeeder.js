const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Transport = require('../models/transport');
const TransportType = require('../models/transportType');
const User = require('../models/user');

const seedDatabase = async () => {
  try {
    // Seed Transport Types first
    const transportTypes = [
      { name: 'Bus' },
      { name: 'Train' },
      { name: 'Car' },
      // Add more transport types as needed
    ];

    await TransportType.sync({ force: true });
    await TransportType.bulkCreate(transportTypes);
    console.log('Transport types seeded successfully');

    // Seed Transports next
    const transports = [
      {
        model: 'Car',
        typeId: 3, // Assuming Car has ID 3 in TransportType table
        capacity: 5,
        driverId: 1, // Replace with existing user ID (driver)
        licencePlate: 'ABC123',
        img: null, // Replace with actual image blob if needed
      },
      {
        model: 'Bus',
        typeId: 1, // Assuming Bus has ID 1 in TransportType table
        capacity: 30,
        driverId: 2, // Replace with another existing user ID (driver)
        licencePlate: 'XYZ456',
        img: null, // Replace with actual image blob if needed
      },
      // Add more transports as needed
    ];

    await Transport.sync({ force: true });
    await Transport.bulkCreate(transports);
    console.log('Transports seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    sequelize.close(); // Close the database connection after seeding
  }
};

seedDatabase();
