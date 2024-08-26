const express = require('express');
const cors = require('cors');
const http = require('http');
const routeMessage = require('./controllers/wsRouter');
const bodyParser = require('body-parser');
const { WebSocketServer } = require('ws');
require('dotenv').config();
const app = express();
const User = require('./models/user');
const path = require('path');


// Middleware
const { logger, logDecoder, functionLogger } = require('./middlewares/logger');
const backupDatabase = require('./config/backupper');

// Controllers
const userController = require('./controllers/user');
const evacuationController = require('./controllers/evacuation');
const emergencyTypeController = require('./controllers/emergencyType');
const iotDeviceController = require('./controllers/iotDevice');
const zoneController = require('./controllers/zone');
const centerController = require('./controllers/center');

const {checkIfUserWithinZone, checkUserProximityToCenter} = require('./middlewares/geolocationCheck'); // Correct path to your function
const sequelize = require('./config/database');

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger, functionLogger);
app.use(cors())

// API routes
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Use controllers
app.use('/api/emergency-types', emergencyTypeController);
app.use('/api/centers', centerController);
app.use('/api/evacuations', evacuationController);
app.use('/api/iot-devices', iotDeviceController);
app.use('/api/users', userController);
app.use('/api/zones', zoneController);

// Additional routes or middleware
app.get('/logs', logDecoder('access.log'));
app.use('/api/backup', backupDatabase);

const server = http.createServer(app);

const wsServer = new WebSocketServer({ server });

wsServer.on('connection', (connection) => {
  console.log('Client connected');


  connection.on('message', (message) => {
    routeMessage(message, connection); // Route the incoming message
  });

  connection.on('close', () => {
    console.log('Client disconnected');
  });

  // Check all users' locations when a WebSocket connection is established
  checkAllUsersInZones(connection);
});

// Function to check if all users are within any danger zones
const checkAllUsersInZones = async (websocket) => {
  try {
    const users = await User.findAll();

    users.forEach(user => {
      checkIfUserWithinZone(user, websocket);
      checkUserProximityToCenter(user, websocket); // Pass the WebSocket connection
    });
  } catch (error) {
    console.error('Error checking users in zones:', error);
  }
};
// Server listen
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
