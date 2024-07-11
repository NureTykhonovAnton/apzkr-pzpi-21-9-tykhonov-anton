// transportTypeRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const TRANSPORT_TYPES_API_URL = `${API_BASE_URL}/transport-types`;

export const fetchTransportTypes = async () => {
  try {
    const response = await axios.get(TRANSPORT_TYPES_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching transport types:', error);
    throw error;
  }
};

export const createTransportType = async (type) => {
  try {
    const response = await axios.post(TRANSPORT_TYPES_API_URL, type);
    return response.data;
  } catch (error) {
    console.error('Error creating transport type:', error);
    throw error;
  }
};

export const getTransportTypeById = async (id) => {
  try {
    const response = await axios.get(`${TRANSPORT_TYPES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transport type with ID ${id}:`, error);
    throw error;
  }
};

export const updateTransportType = async (id, type) => {
  try {
    const response = await axios.put(`${TRANSPORT_TYPES_API_URL}/${id}`, type);
    return response.data;
  } catch (error) {
    console.error(`Error updating transport type with ID ${id}:`, error);
    throw error;
  }
};

export const deleteTransportType = async (id) => {
  try {
    const response = await axios.delete(`${TRANSPORT_TYPES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting transport type with ID ${id}:`, error);
    throw error;
  }
};
