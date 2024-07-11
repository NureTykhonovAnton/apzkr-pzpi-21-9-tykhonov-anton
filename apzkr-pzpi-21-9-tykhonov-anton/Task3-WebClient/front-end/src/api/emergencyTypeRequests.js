// emergencyTypeRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const EMERGENCY_TYPES_API_URL = `${API_BASE_URL}/emergency-types`;

export const fetchEmergencyTypes = async () => {
  try {
    const response = await axios.get(EMERGENCY_TYPES_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching emergency types:', error);
    throw error;
  }
};

export const createEmergencyType = async (type) => {
  try {
    const response = await axios.post(EMERGENCY_TYPES_API_URL, type);
    return response.data;
  } catch (error) {
    console.error('Error creating emergency type:', error);
    throw error;
  }
};

export const getEmergencyTypeById = async (id) => {
  try {
    const response = await axios.get(`${EMERGENCY_TYPES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching emergency type with ID ${id}:`, error);
    throw error;
  }
};

export const updateEmergencyType = async (id, type) => {
  try {
    const response = await axios.put(`${EMERGENCY_TYPES_API_URL}/${id}`, type);
    return response.data;
  } catch (error) {
    console.error(`Error updating emergency type with ID ${id}:`, error);
    throw error;
  }
};

export const deleteEmergencyType = async (id) => {
  try {
    const response = await axios.delete(`${EMERGENCY_TYPES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting emergency type with ID ${id}:`, error);
    throw error;
  }
};
