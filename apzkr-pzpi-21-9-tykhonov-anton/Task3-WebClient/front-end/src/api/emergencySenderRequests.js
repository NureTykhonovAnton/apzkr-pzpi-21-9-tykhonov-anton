// emergencySenderRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const EMERGENCY_SENDERS_API_URL = `${API_BASE_URL}/emergency-senders`;

export const fetchEmergencySenders = async () => {
  try {
    const response = await axios.get(EMERGENCY_SENDERS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching emergency senders:', error);
    throw error;
  }
};

export const createEmergencySender = async (sender) => {
  try {
    const response = await axios.post(EMERGENCY_SENDERS_API_URL, sender);
    return response.data;
  } catch (error) {
    console.error('Error creating emergency sender:', error);
    throw error;
  }
};

export const getEmergencySenderById = async (id) => {
  try {
    const response = await axios.get(`${EMERGENCY_SENDERS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching emergency sender with ID ${id}:`, error);
    throw error;
  }
};

export const updateEmergencySender = async (id, sender) => {
  try {
    const response = await axios.put(`${EMERGENCY_SENDERS_API_URL}/${id}`, sender);
    return response.data;
  } catch (error) {
    console.error(`Error updating emergency sender with ID ${id}:`, error);
    throw error;
  }
};

export const deleteEmergencySender = async (id) => {
  try {
    const response = await axios.delete(`${EMERGENCY_SENDERS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting emergency sender with ID ${id}:`, error);
    throw error;
  }
};
