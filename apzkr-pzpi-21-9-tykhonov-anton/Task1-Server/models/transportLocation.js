const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Transport = require('./transport'); // Подключаем модель Transport

const TransportLocation = sequelize.define('TransportLocation', {
  transportId: {
    type: DataTypes.INTEGER,
  },
  longitude: {
    type: DataTypes.FLOAT,
  },
  latitude: {
    type: DataTypes.FLOAT,
  },
});

// Определяем ассоциацию
TransportLocation.belongsTo(Transport, { foreignKey: 'transportId', as: 'transport' });

module.exports = TransportLocation;
