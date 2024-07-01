const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const IoTSettings = require('../models/iotSettings');

const seedIoTSettings = async () => {
  try {
    const settings = [
      {
        settingName: 'Setting 1',
        description: 'Description for Setting 1',
      },
      {
        settingName: 'Setting 2',
        description: 'Description for Setting 2',
      },
      // Add more settings as needed
    ];

    await IoTSettings.sync({ force: true }); // Drop table and re-create it

    // Insert the predefined settings
    await IoTSettings.bulkCreate(settings);

    console.log('IoTSettings seeded successfully');
  } catch (error) {
    console.error('Error seeding IoTSettings:', error);
  } finally {
    sequelize.close(); // Close the database connection
  }
};

seedIoTSettings();
