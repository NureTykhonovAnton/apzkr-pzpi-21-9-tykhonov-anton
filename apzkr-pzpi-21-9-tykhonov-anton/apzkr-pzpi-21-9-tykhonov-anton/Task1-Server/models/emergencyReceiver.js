const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const IoTDevice = require('./iotDevice');
const Emergency = require('./emergency');

const EmergencyReceiver = sequelize.define('EmergencyReceiver', {
  receiverType: {
    type: DataTypes.ENUM('user', 'iotDevice'),
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

EmergencyReceiver.belongsTo(Emergency, { foreignKey: 'emergencyId' });

// Полиморфные ассоциации
EmergencyReceiver.belongsTo(User, {
  foreignKey: 'receiverId',
  constraints: false,
  as: 'userReceiver', // Псевдоним для связи с User
  scope: {
    receiverType: 'user', // Тип получателя
  },
});

EmergencyReceiver.belongsTo(IoTDevice, {
  foreignKey: 'receiverId',
  constraints: false,
  as: 'deviceReceiver', // Псевдоним для связи с IoTDevice
  scope: {
    receiverType: 'iotDevice', // Тип получателя
  },
});

module.exports = EmergencyReceiver;
