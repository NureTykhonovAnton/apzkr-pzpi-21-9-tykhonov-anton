const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const IoTSettings = require('./iotSettings');

const IoTDevice = sequelize.define('IoTDevice', {
  MACADDR: {
    type: DataTypes.STRING,
  },
  longitude: {
    type: DataTypes.FLOAT,
  },
  latitude: {
    type: DataTypes.FLOAT,
  },
});

IoTDevice.belongsTo(IoTSettings, { foreignKey: 'settingsId', as: 'settings' });

module.exports = IoTDevice;