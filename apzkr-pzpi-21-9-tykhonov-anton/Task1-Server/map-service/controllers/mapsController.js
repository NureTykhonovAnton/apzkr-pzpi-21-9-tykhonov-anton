require('dotenv').config();
const express = require('express');
const router = express.Router();
const apiKey = process.env.APIKEY;
const standardZoom = process.env.ZOOM

router.get('/point', async(req,res) =>{
  
  if(!apiKey) return res.status(404).json({error: 'Problem with Api Key'})

  // Construct the necessary data for the client to render the map
  const mapData = {
    apikey: apiKey,
    zoom: standardZoom
  };

  // Return the data as JSON
  return res.status(200).json(mapData);
});

module.exports = router
