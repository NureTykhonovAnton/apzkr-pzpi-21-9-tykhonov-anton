const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Optional: Ensure username is unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  img: {
    type: DataTypes.BLOB,
    allowNull: true,
  },
  roleId: {
    type: DataTypes.INTEGER, // Specify the data type for roleId
    allowNull: false, // Make sure roleId is not null
    references: {
      model: 'Roles', // Name of the roles table in the database
      key: 'id'
    }
  }
});

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

module.exports = User;