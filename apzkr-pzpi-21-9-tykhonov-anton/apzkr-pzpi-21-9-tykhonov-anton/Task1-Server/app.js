const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

// Middleware
const { logger, logDecoder } = require('./middlewares/logger');
const backupDatabase = require('./config/backupper');

// Controllers
const roleController = require('./controllers/role');
const transportationVehicleController = require('./controllers/transport');
const userController = require('./controllers/user');
const evacuationController = require('./controllers/evacuation');
const emergencyController = require('./controllers/emergency');
const emergencyReceiverController = require('./controllers/emergencyReceiver');
const emergencySenderController = require('./controllers/emergencySender');
const emergencyTypeController = require('./controllers/emergencyType');
const iotDeviceController = require('./controllers/iotDevice');
const routeController = require('./controllers/route');
const transportLocationController = require('./controllers/transportLocation');
const transportTypeController = require('./controllers/transportType');
const userLocationController = require('./controllers/userLocation');
const zoneController = require('./controllers/zone');
const centerController = require('./controllers/center');
const iotSettingsController = require('./controllers/iotSettings');

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);
app.use(cors({
  origin: 'http://localhost:3000'
}));

// API routes
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Use controllers
app.use('/api/emergencies', emergencyController);
app.use('/api/emergency-receivers', emergencyReceiverController);
app.use('/api/emergency-senders', emergencySenderController);
app.use('/api/emergency-types', emergencyTypeController);
app.use('/api/centers', centerController);
app.use('/api/evacuations', evacuationController);
app.use('/api/iot-devices', iotDeviceController);
app.use('/api/iot-settings', iotSettingsController);
app.use('/api/roles', roleController);
app.use('/api/routes', routeController);
app.use('/api/transportation-vehicles', transportationVehicleController);
app.use('/api/transport-locations', transportLocationController);
app.use('/api/transport-types', transportTypeController);
app.use('/api/users', userController);
app.use('/api/user-locations', userLocationController);
app.use('/api/zones', zoneController);

// Additional routes or middleware
app.use('/log', logDecoder('./access.log'));
app.use('/api/backup', backupDatabase);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});