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

router.post('/map', async(req,res)=>{
  const { latitude, longitude } = req.body;

  if(!apiKey) return res.status(404).json({error: 'Problem with Api Key'})
  
    if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }
  const platform = new H.service.Platform({apikey});
  const newMap = new H.Map(
    mapRef.current,
    defaultLayers.vector.normal.map, {
        zoom: 14,
        center: {
            lat: 64.144,
            lng: -21.94,
        },
    }
);
})
// router.get('/icons', async(req,res)=>{
  
// })

module.exports = router
