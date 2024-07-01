const express = require('express');
require('dotenv').config();
const mapsController = require('./controllers/mapsController');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

app.get('/geocode', mapsController.geocode);
app.get('/route', mapsController.getRoute);
app.post('/map', mapsController.getMapData);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
