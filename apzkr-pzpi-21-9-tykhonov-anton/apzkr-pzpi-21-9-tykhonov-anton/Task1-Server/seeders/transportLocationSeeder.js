const TransportLocation = require('../models/transportLocation'); // Adjust the path based on your project structure

const seedTransportLocations = async () => {
  try {
    const transportLocations = [
      {
        transportId: 1, // Replace with existing transport ID
        longitude: 45.1234,
        latitude: 12.3456,
      },
      {
        transportId: 2, // Replace with another existing transport ID
        longitude: 46.789,
        latitude: 11.234,
      },
      // Add more transport locations as needed
    ];

    await TransportLocation.sync({ force: true }); // This will drop the table and recreate it
    await TransportLocation.bulkCreate(transportLocations);
    console.log('Transport locations seeded successfully');
  } catch (error) {
    console.error('Error seeding transport locations:', error);
  }
};

seedTransportLocations();
