const { Sequelize } = require('sequelize');
const config = require('./config.json'); // Adjust the path if necessary
const env = process.env.NODE_ENV || 'development';

const dbConfig = config[env];

const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  storage: dbConfig.storage,
  database: dbConfig.database,
  username: dbConfig.username,
  password: dbConfig.password,
  host: dbConfig.host,
  logging: console.log
});

module.exports = sequelize;
