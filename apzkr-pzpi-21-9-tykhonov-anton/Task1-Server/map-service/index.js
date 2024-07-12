const express = require('express');
require('dotenv').config();
const mapsController = require('./controllers/mapsController');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api', mapsController);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
