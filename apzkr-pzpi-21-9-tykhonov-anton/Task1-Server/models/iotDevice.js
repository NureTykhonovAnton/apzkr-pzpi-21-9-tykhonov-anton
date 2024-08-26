const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IoTDevice = sequelize.define('IoTDevice', {
  MACADDR: {
    type: DataTypes.STRING,
  },
  defaultZoneRaduis: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  gasLimit:{
    type: DataTypes.FLOAT,
    allowNull:true,
  },
  longitude: {
    type: DataTypes.FLOAT,
  },
  latitude: {
    type: DataTypes.FLOAT,
  },
});


module.exports = IoTDevice;