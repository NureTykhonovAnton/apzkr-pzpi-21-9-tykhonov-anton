// evacuationRequest.js

import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

// Base URL for the evacuations API
const EVACUATION_API_URL = `${API_BASE_URL}/evacuations`;

/**
 * Fetches a list of all evacuation processes from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of evacuation objects.
 * @throws Will throw an error if the request fails.
 */
export const fetchEvacuations = async () => {
  try {
    const response = await axios.get(EVACUATION_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching evacuation processes:', error);
    throw error;
  }
};

/**
 * Creates a new evacuation process by sending a POST request to the API.
 * @param {Object} evacuation - The evacuation data to be created.
 * @returns {Promise<Object>} A promise that resolves to the newly created evacuation object.
 * @throws Will throw an error if the request fails.
 */
export const createEvacuation = async (evacuation) => {
  try {
    const response = await axios.post(EVACUATION_API_URL, evacuation);
    return response.data;
  } catch (error) {
    console.error('Error creating evacuation process:', error);
    throw error;
  }
};

/**
 * Retrieves an evacuation process by the user ID from the API.
 * @param {string} userId - The ID of the user for whom to fetch the evacuation process.
 * @returns {Promise<Object>} A promise that resolves to the evacuation object associated with the given user ID.
 * @throws Will throw an error if the request fails.
 */
export const getEvacuationByUserId = async (userId) => {
  try {
    const response = await axios.get(`${EVACUATION_API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching evacuation data:', error);
    // Throws the server error response or a default error message if the response is not available
    throw error.response?.data || { message: 'Server Error' };
  }
};

/**
 * Updates an existing evacuation process by sending a PUT request to the API.
 * @param {string} id - The ID of the evacuation process to be updated.
 * @param {Object} evacuation - The updated evacuation data.
 * @returns {Promise<Object>} A promise that resolves to the updated evacuation object.
 * @throws Will throw an error if the request fails.
 */
export const updateEvacuation = async (id, evacuation) => {
  try {
    const response = await axios.put(`${EVACUATION_API_URL}/${id}`, evacuation);
    return response.data;
  } catch (error) {
    console.error(`Error updating evacuation process with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes an evacuation process by its ID from the API.
 * @param {string} id - The ID of the evacuation process to be deleted.
 * @returns {Promise<Object>} A promise that resolves to the response from the API after deletion.
 * @throws Will throw an error if the request fails.
 */
export const deleteEvacuation = async (id) => {
  try {
    const response = await axios.delete(`${EVACUATION_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting evacuation process with ID ${id}:`, error);
    throw error;
  }
};
