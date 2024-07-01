const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const UserLocation = sequelize.define('UserLocation', {
userId:{
    type:DataTypes.INTEGER
}, 
longitude:{
    type:DataTypes.FLOAT
  },
  latitude:{
    type:DataTypes.FLOAT
  },
});
UserLocation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
module.exports = UserLocation;