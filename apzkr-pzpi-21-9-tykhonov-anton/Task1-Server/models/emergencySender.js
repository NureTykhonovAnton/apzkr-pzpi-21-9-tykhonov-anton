const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const IoTDevice = require('./iotDevice');
const Emergency = require('./emergency');

const EmergencySender = sequelize.define('EmergencySender', {
  senderType: {
    type: DataTypes.ENUM('user', 'iotDevice'),
    allowNull: false,
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

EmergencySender.belongsTo(Emergency, { foreignKey: 'emergencyId' });

// Полиморфные ассоциации
EmergencySender.belongsTo(User, {
  foreignKey: 'senderId',
  constraints: false, 
  scope: {
    senderType: 'user', 
  },
});

EmergencySender.belongsTo(IoTDevice, {
  foreignKey: 'senderId',
  constraints: false,
  scope: {
    senderType: 'iotDevice',
  },
});

module.exports = EmergencySender;
