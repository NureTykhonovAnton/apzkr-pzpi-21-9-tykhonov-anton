const { DataTypes, BOOLEAN } = require('sequelize');
const sequelize = require('../config/database');
const EmergencyType = require('./emergencyType');

const Emergency = sequelize.define('Emergency', {
  startedAt: {
    type: DataTypes.DATE,
  },
  endedAt: {
    type: DataTypes.DATE,
  },
  hasEnded: {
    type: BOOLEAN,
    defaultValue: false,
  },
  type: {
    type: DataTypes.INTEGER,
  },
});

Emergency.belongsTo(EmergencyType, { foreignKey: 'emergencyTypeId', as: 'emergencyType' });

module.exports = Emergency;
