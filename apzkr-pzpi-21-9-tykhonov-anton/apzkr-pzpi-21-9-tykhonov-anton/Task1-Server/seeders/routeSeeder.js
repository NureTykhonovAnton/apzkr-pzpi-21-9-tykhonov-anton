const  Route = require('../models/route')
const  Evacuation = require('../models/evacuation')
const  Transport = require('../models/transport')
const seedRoutes = async () => {
  try {
    // Example route data
    const routes = [
      {
        transportId: 1, // Replace with existing transport ID
        evacuationId: 1, // Replace with existing evacuation ID
      },
      {
        transportId: 2, // Replace with another existing transport ID
        evacuationId: 2, // Replace with another existing evacuation ID
      },
      // Add more routes as needed
    ];

    await Route.sync({ force: true }); // This will drop the table and recreate it
    await Route.bulkCreate(routes);
    console.log('Routes seeded successfully');
  } catch (error) {
    console.error('Error seeding routes:', error);
  }
};

seedRoutes();
