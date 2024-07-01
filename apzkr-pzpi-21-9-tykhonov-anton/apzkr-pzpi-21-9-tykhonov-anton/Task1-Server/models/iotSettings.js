const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IoTSettings = sequelize.define('IoTSettings', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = IoTSettings;
