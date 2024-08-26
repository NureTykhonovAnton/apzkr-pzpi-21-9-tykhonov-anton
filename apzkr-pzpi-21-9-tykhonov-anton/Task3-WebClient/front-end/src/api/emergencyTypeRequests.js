// emergencyTypeRequest.js

import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

// Base URL for the emergency types API
const EMERGENCY_TYPES_API_URL = `${API_BASE_URL}/emergency-types`;

/**
 * Fetches a list of emergency types from the API.
 * @returns {Promise<Array>} A promise that resolves to an array of emergency type objects.
 * @throws Will throw an error if the request fails.
 */
export const fetchEmergencyTypes = async () => {
  try {
    const response = await axios.get(EMERGENCY_TYPES_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching emergency types:', error);
    throw error;
  }
};

/**
 * Creates a new emergency type by sending a POST request to the API.
 * @param {Object} type - The emergency type data to be created.
 * @returns {Promise<Object>} A promise that resolves to the newly created emergency type object.
 * @throws Will throw an error if the request fails.
 */
export const createEmergencyType = async (type) => {
  try {
    const response = await axios.post(EMERGENCY_TYPES_API_URL, type);
    return response.data;
  } catch (error) {
    console.error('Error creating emergency type:', error);
    throw error;
  }
};

/**
 * Retrieves a specific emergency type by its ID from the API.
 * @param {string} id - The ID of the emergency type to be retrieved.
 * @returns {Promise<Object>} A promise that resolves to the emergency type object with the given ID.
 * @throws Will throw an error if the request fails.
 */
export const getEmergencyTypeById = async (id) => {
  try {
    const response = await axios.get(`${EMERGENCY_TYPES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching emergency type with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Updates an existing emergency type by sending a PUT request to the API.
 * @param {string} id - The ID of the emergency type to be updated.
 * @param {Object} type - The updated emergency type data.
 * @returns {Promise<Object>} A promise that resolves to the updated emergency type object.
 * @throws Will throw an error if the request fails.
 */
export const updateEmergencyType = async (id, type) => {
  try {
    const response = await axios.put(`${EMERGENCY_TYPES_API_URL}/${id}`, type);
    return response.data;
  } catch (error) {
    console.error(`Error updating emergency type with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a specific emergency type by its ID from the API.
 * @param {string} id - The ID of the emergency type to be deleted.
 * @returns {Promise<Object>} A promise that resolves to the response from the API after deletion.
 * @throws Will throw an error if the request fails.
 */
export const deleteEmergencyType = async (id) => {
  try {
    const response = await axios.delete(`${EMERGENCY_TYPES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting emergency type with ID ${id}:`, error);
    throw error;
  }
};
