// transportLocationRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const TRANSPORT_LOCATIONS_API_URL = `${API_BASE_URL}/transport-locations`;

export const fetchTransportLocations = async () => {
  try {
    const response = await axios.get(TRANSPORT_LOCATIONS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching transport locations:', error);
    throw error;
  }
};

export const createTransportLocation = async (location) => {
  try {
    const response = await axios.post(TRANSPORT_LOCATIONS_API_URL, location);
    return response.data;
  } catch (error) {
    console.error('Error creating transport location:', error);
    throw error;
  }
};

export const getTransportLocationById = async (id) => {
  try {
    const response = await axios.get(`${TRANSPORT_LOCATIONS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transport location with ID ${id}:`, error);
    throw error;
  }
};

export const updateTransportLocation = async (id, location) => {
  try {
    const response = await axios.put(`${TRANSPORT_LOCATIONS_API_URL}/${id}`, location);
    return response.data;
  } catch (error) {
    console.error(`Error updating transport location with ID ${id}:`, error);
    throw error;
  }
};

export const deleteTransportLocation = async (id) => {
  try {
    const response = await axios.delete(`${TRANSPORT_LOCATIONS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting transport location with ID ${id}:`, error);
    throw error;
  }
};
