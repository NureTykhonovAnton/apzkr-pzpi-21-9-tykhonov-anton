// zoneRequest.js

import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const ZONES_API_URL = `${API_BASE_URL}/zones`;

/**
 * Fetches all zones.
 *
 * Sends a GET request to the `/zones` endpoint to retrieve a list of all zones.
 *
 * @async
 * @function fetchZones
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of zone data.
 * @throws {Error} Throws an error if the request fails.
 */
export const fetchZones = async () => {
  try {
    const response = await axios.get(ZONES_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching zones:', error);
    throw error;
  }
};

/**
 * Creates a new zone.
 *
 * Sends a POST request to the `/zones` endpoint with the zone data to create a new zone.
 *
 * @async
 * @function createZone
 * @param {Object} zone - The data of the zone to be created.
 * @param {string} zone.name - The name of the zone.
 * @param {string} zone.description - The description of the zone.
 * @returns {Promise<Object>} A promise that resolves to the newly created zone data.
 * @throws {Error} Throws an error if the request fails.
 */
export const createZone = async (zone) => {
  try {
    const response = await axios.post(ZONES_API_URL, zone);
    return response.data;
  } catch (error) {
    console.error('Error creating zone:', error);
    throw error;
  }
};

/**
 * Fetches a zone by its ID.
 *
 * Sends a GET request to the `/zones/{id}` endpoint to retrieve the zone with the specified ID.
 *
 * @async
 * @function getZoneById
 * @param {string} id - The ID of the zone to fetch.
 * @returns {Promise<Object>} A promise that resolves to the zone data.
 * @throws {Error} Throws an error if the request fails.
 */
export const getZoneById = async (id) => {
  try {
    const response = await axios.get(`${ZONES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching zone with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Updates an existing zone.
 *
 * Sends a PUT request to the `/zones/{id}` endpoint to update the zone with the specified ID.
 *
 * @async
 * @function updateZone
 * @param {string} id - The ID of the zone to update.
 * @param {Object} zone - The new data for the zone.
 * @param {string} zone.name - The updated name of the zone.
 * @param {string} zone.description - The updated description of the zone.
 * @returns {Promise<Object>} A promise that resolves to the updated zone data.
 * @throws {Error} Throws an error if the request fails.
 */
export const updateZone = async (id, zone) => {
  try {
    const response = await axios.put(`${ZONES_API_URL}/${id}`, zone);
    return response.data;
  } catch (error) {
    console.error(`Error updating zone with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes a zone.
 *
 * Sends a DELETE request to the `/zones/{id}` endpoint to remove the zone with the specified ID.
 *
 * @async
 * @function deleteZone
 * @param {string} id - The ID of the zone to delete.
 * @returns {Promise<Object>} A promise that resolves to the response data upon successful deletion.
 * @throws {Error} Throws an error if the request fails.
 */
export const deleteZone = async (id) => {
  try {
    const response = await axios.delete(`${ZONES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting zone with ID ${id}:`, error);
    throw error;
  }
};
