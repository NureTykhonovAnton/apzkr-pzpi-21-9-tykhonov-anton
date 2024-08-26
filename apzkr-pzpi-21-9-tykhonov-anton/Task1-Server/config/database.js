const { Sequelize } = require('sequelize');
const config = require('./config.json');
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

/**
 * @module database
 * @description Configures and exports an instance of Sequelize for database interactions.
 * 
 * This module sets up Sequelize using configuration from a JSON file, depending on the current environment
 * (development, production, etc.). It initializes Sequelize with the specified database parameters such as
 * dialect, storage, database name, username, password, and host. It also enables logging of SQL queries.
 * 
 * @see {@link https://sequelize.org/|Sequelize Documentation} for more information on Sequelize configuration.
 * 
 * @constant {Sequelize} sequelize - The Sequelize instance configured for database operations.
 * 
 * @example
 * const sequelize = require('./path/to/this/file');
 * 
 * // Example of using the Sequelize instance
 * sequelize.authenticate()
 *   .then(() => {
 *     console.log('Connection has been established successfully.');
 *   })
 *   .catch(err => {
 *     console.error('Unable to connect to the database:', err);
 *   });
 */
