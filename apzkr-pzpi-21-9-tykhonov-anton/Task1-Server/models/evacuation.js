const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Zone = require('./zone');
const Center = require('./center');
const User = require('./user');

const Evacuation = sequelize.define('Evacuation', {
  // Foreign key to Zone for the start location
  startZoneId: {
    type: DataTypes.INTEGER,
    references: {
      model: Zone,
      key: 'id',
    },
    allowNull: true,
  },
  
  // Foreign key to Center for the destination
  endCenterId: {
    type: DataTypes.INTEGER,
    references: {
      model: Center,
      key: 'id',
    },
    allowNull: false,
  },
  
  // Foreign key to User for the person responsible for the evacuation
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
});

// Define associations
Evacuation.belongsTo(Zone, { foreignKey: 'startZoneId', as: 'startZone' });
Evacuation.belongsTo(Center, { foreignKey: 'endCenterId', as: 'endCenter' });
Evacuation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Evacuation;
