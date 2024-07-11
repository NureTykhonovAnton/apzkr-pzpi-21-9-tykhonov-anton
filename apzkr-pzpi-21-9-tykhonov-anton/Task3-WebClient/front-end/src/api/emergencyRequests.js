// emergencyRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const EMERGENCIES_API_URL = `${API_BASE_URL}/emergencies`;

export const fetchEmergencies = async () => {
  try {
    const response = await axios.get(EMERGENCIES_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching emergencies:', error);
    throw error;
  }
};

export const createEmergency = async (emergency) => {
  try {
    const response = await axios.post(EMERGENCIES_API_URL, emergency);
    return response.data;
  } catch (error) {
    console.error('Error creating emergency:', error);
    throw error;
  }
};

export const getEmergencyById = async (id) => {
  try {
    const response = await axios.get(`${EMERGENCIES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching emergency with ID ${id}:`, error);
    throw error;
  }
};

export const updateEmergency = async (id, emergency) => {
  try {
    const response = await axios.put(`${EMERGENCIES_API_URL}/${id}`, emergency);
    return response.data;
  } catch (error) {
    console.error(`Error updating emergency with ID ${id}:`, error);
    throw error;
  }
};

export const deleteEmergency = async (id) => {
  try {
    const response = await axios.delete(`${EMERGENCIES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting emergency with ID ${id}:`, error);
    throw error;
  }
};
