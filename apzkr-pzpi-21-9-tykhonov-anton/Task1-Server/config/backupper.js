const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbFilePath = path.join(__dirname, '../database.db');
const backupDir = path.join(__dirname, '../db_backups');

/**
 * @function backupDatabase
 * @description Creates a backup of the database file and stores it in a backup directory.
 * 
 * This function checks if the database file exists. If it does, it creates a backup by copying the database file
 * to a backup directory with a timestamp in the filename. If the file does not exist or if an error occurs during
 * the backup process, it responds with an appropriate error message.
 * 
 * @param {express.Request} req - The HTTP request object.
 * @param {express.Response} res - The HTTP response object.
 * @throws {Error} Throws an error if the database file does not exist or if there is an error during the backup process.
 * 
 * @returns {Promise<void>} Returns a promise that resolves when the backup operation completes.
 */
async function backupDatabase(req, res) {
  try {
    if (!fs.existsSync(dbFilePath)) {
      return res.status(404).json({ error: 'Database file does not exist: ' + dbFilePath });
    }

    const backupFilePath = path.join(
      backupDir,
      `backup-${path.basename(dbFilePath)}-${new Date().toISOString().replace(/[:.]/g, '-')}.db`
    );

    await fs.promises.copyFile(dbFilePath, backupFilePath);
    res.status(200).json({ message: 'Backup created successfully: ' + backupFilePath });
  } catch (err) {
    res.status(500).json({ error: 'Error creating backup: ' + err.message });
  }
}

module.exports = backupDatabase;

