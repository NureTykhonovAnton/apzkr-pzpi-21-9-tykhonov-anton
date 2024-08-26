// centerRequest.js

import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

// Base URL for the centers API
const CENTERS_API_URL = `${API_BASE_URL}/centers`;

/**
 * Fetches a list of centers from the API.
 * @returns {Promise<Array>} A promise that resolves to the array of center objects.
 * @throws Will throw an error if the request fails.
 */
export const fetchCenters = async () => {
  try {
    const response = await axios.get(CENTERS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching centers:', error);
    throw error;
  }
};

/**
 * Creates a new center by sending a POST request to the API.
 * @param {Object} center - The center data to be created.
 * @returns {Promise<Object>} A promise that resolves to the newly created center object.
 * @throws Will throw an error if the request fails.
 */
export const createCenter = async (center) => {
  try {
    const response = await axios.post(CENTERS_API_URL, center);
    return response.data;
  } catch (error) {
    console.error('Error creating center:', error);
    throw error;
  }
};

/**
 * Retrieves a specific center by its ID from the API.
 * @param {string} id - The ID of the center to be retrieved.
 * @returns {Promise<Object>} A promise that resolves to the center object with the given ID.
 * @throws Will throw an error if the request fails.
 */
export const getCenterById = async (id) => {
  try {
    const response = await axios.get(`${CENTERS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching center with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Updates an existing center by sending a PUT request to the API.
 * @param {string} id - The ID of the center to be updated.
 * @param {Object} center - The updated center data.
 * @returns {Promise<Object>} A promise that resolves to the updated center object.
 * @throws Will throw an error if the request fails.
 */
export const updateCenter = async (id, center) => {
  try {
    const response = await axios.put(`${CENTERS_API_URL}/${id}`, center);
    return response.data;
  } catch (error) {
    console.error(`Error updating center with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a specific center by its ID from the API.
 * @param {string} id - The ID of the center to be deleted.
 * @returns {Promise<Object>} A promise that resolves to the response from the API after deletion.
 * @throws Will throw an error if the request fails.
 */
export const deleteCenter = async (id) => {
  try {
    const response = await axios.delete(`${CENTERS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting center with ID ${id}:`, error);
    throw error;
  }
};
