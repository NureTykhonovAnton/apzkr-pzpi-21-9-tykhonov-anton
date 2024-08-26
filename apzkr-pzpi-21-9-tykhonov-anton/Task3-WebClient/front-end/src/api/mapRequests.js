// mapRequest.js

import axios from 'axios';
import { API_MAP_URL } from '../utils/config';

// Define the base URL for the map API
const MAP_API_URL = `${API_MAP_URL}`;

/**
 * Fetches map data from the API.
 *
 * This function sends a GET request to the map API endpoint to retrieve data about map points.
 *
 * @async
 * @function fetchMapData
 * @returns {Promise<Object>} A promise that resolves to the map data retrieved from the API.
 * @throws {Error} Throws an error if the request fails or if there is an issue with the API.
 */
const fetchMapData = async () => {
  try {
    // Send a GET request to the map API endpoint
    const response = await axios.get(`${MAP_API_URL}/point`);
    // Return the data from the response
    return response.data;
  } catch (error) {
    // Log the error and rethrow it to be handled by the caller
    console.error('Error fetching map data:', error);
    throw error;
  }
};

export default fetchMapData;
