const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
require('dotenv').config();

const dbFilePath = path.join(__dirname, '../database.db'); 
const backupDir = path.join(__dirname, '../db_backups'); 


function backupDatabase() {
  return new Promise((resolve, reject) => {

    if (!fs.existsSync(dbFilePath)) {
      return reject(new Error('Database file does not exist: ' + dbFilePath));
    }


    const backupFilePath = path.join(
      backupDir,
      `backup-${path.basename(dbFilePath)}-${new Date().toISOString().replace(/[:.]/g, '-')}.db`
    );


    fs.copyFile(dbFilePath, backupFilePath, (err) => {
      if (err) {
        return reject(new Error('Error creating backup: ' + err));
      } else {
        resolve('Backup created successfully: ' + backupFilePath);
      }
    });
  });
}

router.post('/backup', async (req, res) => {
  try {
    const result = await backupDatabase();
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
