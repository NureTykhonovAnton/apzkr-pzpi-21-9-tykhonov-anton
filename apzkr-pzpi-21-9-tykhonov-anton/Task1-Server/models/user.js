const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./role');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  img:{
    type: DataTypes.BLOB,
    allowNull: true,
  },
  roleId:{
    type: DataTypes.INTEGER,
  }
});
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

module.exports = User;
