const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Zone = require('./zone');
const Center = require('./center');
const Emergency = require('./emergency');

const Evacuation = sequelize.define('Evacuation', {
  zoneStart: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  centerEnd: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  emergencyId:{
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

Evacuation.belongsTo(Zone, { foreignKey: 'zoneStart', as: 'startZone' });
Evacuation.belongsTo(Center, { foreignKey: 'centerEnd', as: 'endCenter' });
Evacuation.belongsTo(Emergency,{foreignKey: 'emergencyId', as: 'emergency'});
module.exports = Evacuation;
