const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Zone = sequelize.define('Zone', {
  name: {
    type: DataTypes.STRING,
  },
  longitude: {
    type: DataTypes.FLOAT,
  },
  latitude: {
    type: DataTypes.FLOAT,
  },
  radius: {
    type: DataTypes.FLOAT,
  }
});

module.exports = Zone;
