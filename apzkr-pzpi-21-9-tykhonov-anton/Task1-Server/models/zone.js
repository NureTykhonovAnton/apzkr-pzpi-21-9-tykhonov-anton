const { DataTypes, BOOLEAN } = require('sequelize');
const sequelize = require('../config/database');
const EmergencyType = require('./emergencyType');

const Zone = sequelize.define('Zone', {
  // Emergency fields
  startedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  emergencyTypeId: {
    type: DataTypes.INTEGER,
    references: {
      model: EmergencyType,
      key: 'id',
    },
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  radius: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

Zone.belongsTo(EmergencyType, { foreignKey: 'emergencyTypeId', as: 'emergencyType' });

module.exports = Zone;
