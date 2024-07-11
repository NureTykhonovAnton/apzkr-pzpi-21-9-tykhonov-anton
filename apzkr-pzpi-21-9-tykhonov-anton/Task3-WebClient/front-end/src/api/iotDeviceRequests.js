// iotDeviceRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const IOT_DEVICES_API_URL = `${API_BASE_URL}/iot-devices`;

export const fetchIotDevices = async () => {
  try {
    const response = await axios.get(IOT_DEVICES_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching IoT devices:', error);
    throw error;
  }
};

export const createIotDevice = async (device) => {
  try {
    const response = await axios.post(IOT_DEVICES_API_URL, device);
    return response.data;
  } catch (error) {
    console.error('Error creating IoT device:', error);
    throw error;
  }
};

export const getIotDeviceById = async (id) => {
  try {
    const response = await axios.get(`${IOT_DEVICES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching IoT device with ID ${id}:`, error);
    throw error;
  }
};

export const updateIotDevice = async (id, device) => {
  try {
    const response = await axios.put(`${IOT_DEVICES_API_URL}/${id}`, device);
    return response.data;
  } catch (error) {
    console.error(`Error updating IoT device with ID ${id}:`, error);
    throw error;
  }
};

export const deleteIotDevice = async (id) => {
  try {
    const response = await axios.delete(`${IOT_DEVICES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting IoT device with ID ${id}:`, error);
    throw error;
  }
};
