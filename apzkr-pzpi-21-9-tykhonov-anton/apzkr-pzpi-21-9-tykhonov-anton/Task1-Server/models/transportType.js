const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TransportType = sequelize.define('TransportType', {
  name: {
    type: DataTypes.STRING,
  },
});

module.exports = TransportType;