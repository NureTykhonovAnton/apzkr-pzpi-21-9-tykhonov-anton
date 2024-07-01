const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Evacuation = require('./evacuation');
const Transport = require('./transport');

const Route = sequelize.define('Route', {
  transportId: {
    type: DataTypes.INTEGER,
  },
  evacuationId: {
    type: DataTypes.INTEGER,
  }
});

// Определяем ассоциации
Route.belongsTo(Evacuation, { foreignKey: 'evacuationId', as: 'evacuation' });
Route.belongsTo(Transport, { foreignKey: 'transportId', as: 'transport' });
module.exports = Route;