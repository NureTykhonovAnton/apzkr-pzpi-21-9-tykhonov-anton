// zoneRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const ZONES_API_URL = `${API_BASE_URL}/zones`;

export const fetchZones = async () => {
  try {
    const response = await axios.get(ZONES_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching zones:', error);
    throw error;
  }
};

export const createZone = async (zone) => {
  try {
    const response = await axios.post(ZONES_API_URL, zone);
    return response.data;
  } catch (error) {
    console.error('Error creating zone:', error);
    throw error;
  }
};

export const getZoneById = async (id) => {
  try {
    const response = await axios.get(`${ZONES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching zone with ID ${id}:`, error);
    throw error;
  }
};

export const updateZone = async (id, zone) => {
  try {
    const response = await axios.put(`${ZONES_API_URL}/${id}`, zone);
    return response.data;
  } catch (error) {
    console.error(`Error updating zone with ID ${id}:`, error);
    throw error;
  }
};

export const deleteZone = async (id) => {
  try {
    const response = await axios.delete(`${ZONES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting zone with ID ${id}:`, error);
    throw error;
  }
};
