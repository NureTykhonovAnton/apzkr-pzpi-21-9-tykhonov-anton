// emergencyReceiverRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const EMERGENCY_RECEIVERS_API_URL = `${API_BASE_URL}/emergency-receivers`;

export const fetchEmergencyReceivers = async () => {
  try {
    const response = await axios.get(EMERGENCY_RECEIVERS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching emergency receivers:', error);
    throw error;
  }
};

export const createEmergencyReceiver = async (receiver) => {
  try {
    const response = await axios.post(EMERGENCY_RECEIVERS_API_URL, receiver);
    return response.data;
  } catch (error) {
    console.error('Error creating emergency receiver:', error);
    throw error;
  }
};

export const getEmergencyReceiverById = async (id) => {
  try {
    const response = await axios.get(`${EMERGENCY_RECEIVERS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching emergency receiver with ID ${id}:`, error);
    throw error;
  }
};

export const updateEmergencyReceiver = async (id, receiver) => {
  try {
    const response = await axios.put(`${EMERGENCY_RECEIVERS_API_URL}/${id}`, receiver);
    return response.data;
  } catch (error) {
    console.error(`Error updating emergency receiver with ID ${id}:`, error);
    throw error;
  }
};

export const deleteEmergencyReceiver = async (id) => {
  try {
    const response = await axios.delete(`${EMERGENCY_RECEIVERS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting emergency receiver with ID ${id}:`, error);
    throw error;
  }
};
