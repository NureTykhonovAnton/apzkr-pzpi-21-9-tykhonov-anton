const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TransportType = require('./transportType');
const User = require('./user'); 

const Transport = sequelize.define('Transport', {
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  typeId:{
    type: DataTypes.INTEGER,
  },
  capacity:{
    type: DataTypes.INTEGER,
  },
  driverId:{
    type: DataTypes.INTEGER,
  },
  licencePlate:{
    type: DataTypes.STRING,
  },
  img:{
    type: DataTypes.BLOB,
    allowNull: true,
  }
});

Transport.belongsTo(TransportType, { foreignKey: 'typeId', as: 'type' });
Transport.belongsTo(User, { foreignKey: 'driverId', as: 'driver' });

module.exports = Transport;
