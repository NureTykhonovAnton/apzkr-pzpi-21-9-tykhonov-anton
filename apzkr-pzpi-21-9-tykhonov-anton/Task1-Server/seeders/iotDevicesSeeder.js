const  IoTDevice  = require('../models/iotDevice'); // Adjust the path based on your project structure

const seedIoTDevices = async () => {
  try {
    // Example IoT device data
    const devices = [
      {
        MACADDR: '00:11:22:33:44:55',
        settingsId: 1, // Replace with existing settings ID
        longitude: 37.7749, // Example longitude
        latitude: -122.4194, // Example latitude
      },
      {
        MACADDR: '11:22:33:44:55:66',
        settingsId: 2, // Replace with another existing settings ID
        longitude: 40.7128, // Example longitude
        latitude: -74.0060, // Example latitude
      },
      // Add more devices as needed
    ];

    await IoTDevice.sync({ force: true }); // This will drop the table and recreate it
    await IoTDevice.bulkCreate(devices);
    console.log('IoT devices seeded successfully');
  } catch (error) {
    console.error('Error seeding IoT devices:', error);
  }
};

seedIoTDevices();
