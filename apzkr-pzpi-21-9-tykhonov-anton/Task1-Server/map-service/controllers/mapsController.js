require('dotenv').config();
const express = require('express');
const router = express.Router();
const apiKey = process.env.APIKEY;
const standardZoom = process.env.ZOOM

router.post('/point', async(req,res) =>{
  const { latitude, longitude } = req.body;

  if(!apiKey) return res.status(404).json({error: 'Problem with Api Key'})
  
    if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  // Construct the necessary data for the client to render the map
  const mapData = {
    apikey: apiKey,
    latitude: latitude,
    longitude: longitude,
    zoom: standardZoom
  };

  // Return the data as JSON
  return res.status(200).json(mapData);
});

module.exports = router
