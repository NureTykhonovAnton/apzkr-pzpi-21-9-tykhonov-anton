const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const logStream = fs.createWriteStream(path.join(__dirname, '..', 'access.log'), { flags: 'a' });

const logger = morgan('combined', { stream: logStream });

function logDecoder(logFilePath) {
    return (req, res, next) => {
      fs.readFile(logFilePath, 'utf-8', (err, logContent) => {
        if (err) {
          return res.status(500).json({ error: 'Error reading log file', details: err.message });
        }
  
        const logLines = logContent.trim().split('\n');
    
        const logs = logLines.map(line => {
          const logParts = line.split(' ');
          const logObject = {
            ip: logParts[0],
            date: logParts[3] + ' ' + logParts[4],
            method: logParts[5].replace(/"/g, ''),
            url: logParts[6],
            httpVersion: logParts[7].replace(/"/g, ''),
            statusCode: logParts[8],
            contentLength: logParts[9],
            referer: logParts[10].replace(/"/g, ''),
            userAgent: logParts.slice(11).join(' ').replace(/"/g, ''),
          };
          return logObject;
        });
  
        res.status(200).json({ logs });
      });
    };
  }

  const functionLogger = (req, res, next) => {
    if (req.route && req.route.stack) {
      const routeHandler = req.route.stack.find(layer => layer.method);
      if (routeHandler && routeHandler.method) {
        console.log(`Calling function: ${routeHandler.method.name}`);
      } else {
        console.log('Calling function: unknown');
      }
    } else {
      console.log('Calling function: no route stack');
    }
    next();
  };

module.exports = {logger, logDecoder, functionLogger};
