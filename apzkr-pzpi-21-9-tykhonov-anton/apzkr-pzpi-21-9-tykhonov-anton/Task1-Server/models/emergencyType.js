const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmergencyType = sequelize.define('EmergencyType', {
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
});

module.exports = EmergencyType;
