// iotDeviceRequest.js

import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

// Define the base URL for the IoT Devices API
const IOT_DEVICES_API_URL = `${API_BASE_URL}/iot-devices`;

/**
 * Fetches all IoT devices from the server.
 *
 * @returns {Promise<Object[]>} A promise that resolves to the list of IoT devices.
 * @throws {Error} Throws an error if the request fails.
 */
export const fetchIotDevices = async () => {
  try {
    const response = await axios.get(IOT_DEVICES_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching IoT devices:', error);
    throw error;
  }
};

/**
 * Creates a new IoT device on the server.
 *
 * @param {Object} device - The IoT device data to be created.
 * @returns {Promise<Object>} A promise that resolves to the newly created IoT device.
 * @throws {Error} Throws an error if the request fails.
 */
export const createIotDevice = async (device) => {
  try {
    const response = await axios.post(IOT_DEVICES_API_URL, device);
    return response.data;
  } catch (error) {
    console.error('Error creating IoT device:', error);
    throw error;
  }
};

/**
 * Fetches a specific IoT device by its ID.
 *
 * @param {string} id - The ID of the IoT device to fetch.
 * @returns {Promise<Object>} A promise that resolves to the IoT device with the specified ID.
 * @throws {Error} Throws an error if the request fails.
 */
export const getIotDeviceById = async (id) => {
  try {
    const response = await axios.get(`${IOT_DEVICES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching IoT device with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Updates an existing IoT device by its ID.
 *
 * @param {string} id - The ID of the IoT device to update.
 * @param {Object} device - The updated data for the IoT device.
 * @returns {Promise<Object>} A promise that resolves to the updated IoT device.
 * @throws {Error} Throws an error if the request fails.
 */
export const updateIotDevice = async (id, device) => {
  try {
    const response = await axios.put(`${IOT_DEVICES_API_URL}/${id}`, device);
    return response.data;
  } catch (error) {
    console.error(`Error updating IoT device with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Deletes an IoT device by its ID.
 *
 * @param {string} id - The ID of the IoT device to delete.
 * @returns {Promise<Object>} A promise that resolves to the response confirming the deletion.
 * @throws {Error} Throws an error if the request fails.
 */
export const deleteIotDevice = async (id) => {
  try {
    const response = await axios.delete(`${IOT_DEVICES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting IoT device with ID ${id}:`, error);
    throw error;
  }
};
