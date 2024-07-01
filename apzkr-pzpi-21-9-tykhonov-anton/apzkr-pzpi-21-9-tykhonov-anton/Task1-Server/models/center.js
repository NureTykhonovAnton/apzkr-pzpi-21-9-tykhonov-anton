const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Center = sequelize.define('Center', {
  name: {
    type: DataTypes.STRING,
  },
  longitude:{
    type:DataTypes.FLOAT
  },
  latitude:{
    type:DataTypes.FLOAT
  },
});

module.exports = Center;