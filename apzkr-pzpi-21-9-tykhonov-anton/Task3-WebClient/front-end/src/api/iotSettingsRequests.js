// iotSettingsRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const IOT_SETTINGS_API_URL = `${API_BASE_URL}/iot-settings`;

export const fetchIotSettings = async () => {
  try {
    const response = await axios.get(IOT_SETTINGS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching IoT settings:', error);
    throw error;
  }
};

export const createIotSetting = async (setting) => {
  try {
    const response = await axios.post(IOT_SETTINGS_API_URL, setting);
    return response.data;
  } catch (error) {
    console.error('Error creating IoT setting:', error);
    throw error;
  }
};

export const getIotSettingById = async (id) => {
  try {
    const response = await axios.get(`${IOT_SETTINGS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching IoT setting with ID ${id}:`, error);
    throw error;
  }
};

export const updateIotSetting = async (id, setting) => {
  try {
    const response = await axios.put(`${IOT_SETTINGS_API_URL}/${id}`, setting);
    return response.data;
  } catch (error) {
    console.error(`Error updating IoT setting with ID ${id}:`, error);
    throw error;
  }
};

export const deleteIotSetting = async (id) => {
  try {
    const response = await axios.delete(`${IOT_SETTINGS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting IoT setting with ID ${id}:`, error);
    throw error;
  }
};
