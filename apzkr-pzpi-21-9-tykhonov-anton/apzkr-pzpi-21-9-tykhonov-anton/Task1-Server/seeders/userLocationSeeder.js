const UserLocation = require('../models/userLocation'); // Adjust the path based on your project structure
const sequelize = require('../config/database');

const seedUserLocations = async () => {
  try {
    const userLocations = [
      {
        userId: 1, // Replace with existing user ID
        longitude: 45.1234,
        latitude: 12.3456,
      },
      {
        userId: 2, // Replace with another existing user ID
        longitude: 46.789,
        latitude: 11.234,
      },
      // Add more user locations as needed
    ];

    await UserLocation.sync({ force: true }); // This will drop the table and recreate it
    await UserLocation.bulkCreate(userLocations);
    console.log('User locations seeded successfully');
  } catch (error) {
    console.error('Error seeding user locations:', error);
  } finally {
    sequelize.close(); // Close the database connection after seeding
  }
};

seedUserLocations();