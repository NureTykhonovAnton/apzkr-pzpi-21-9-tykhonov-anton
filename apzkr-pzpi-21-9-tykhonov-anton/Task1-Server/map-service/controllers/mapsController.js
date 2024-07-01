const express = require('express');
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.APIKEY;

const geocode = async (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.status(400).json({ error: 'Address parameter is required' });
  }

  const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: 'Failed to fetch data from HERE API', details: error.response.data });
    } else {
      res.status(500).json({ error: 'Failed to fetch data from HERE API', details: error.message });
    }
  }
};

const getRoute = async (req, res) => {
  const { origin, destination } = req.query;
  if (!origin || !destination) {
    return res.status(400).json({ error: 'Origin and destination parameters are required' });
  }

  const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&apiKey=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: 'Failed to fetch data from HERE API', details: error.response.data });
    } else {
      res.status(500).json({ error: 'Failed to fetch data from HERE API', details: error.message });
    }
  }
};

const getMapData = (req, res) => {
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  // Construct the necessary data for the client to render the map
  const mapData = {
    apikey: apiKey,
    latitude,
    longitude,
    zoom: 14
  };

  // Return the data as JSON
  res.json(mapData);
};

module.exports = {
  geocode,
  getRoute,
  getMapData
};
