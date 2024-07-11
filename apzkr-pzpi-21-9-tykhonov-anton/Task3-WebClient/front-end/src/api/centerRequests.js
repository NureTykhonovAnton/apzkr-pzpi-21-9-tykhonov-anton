// centerRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const CENTERS_API_URL = `${API_BASE_URL}/centers`;

export const fetchCenters = async () => {
  try {
    const response = await axios.get(CENTERS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching centers:', error);
    throw error;
  }
};

export const createCenter = async (center) => {
  try {
    const response = await axios.post(CENTERS_API_URL, center);
    return response.data;
  } catch (error) {
    console.error('Error creating center:', error);
    throw error;
  }
};

export const getCenterById = async (id) => {
  try {
    const response = await axios.get(`${CENTERS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching center with ID ${id}:`, error);
    throw error;
  }
};

export const updateCenter = async (id, center) => {
  try {
    const response = await axios.put(`${CENTERS_API_URL}/${id}`, center);
    return response.data;
  } catch (error) {
    console.error(`Error updating center with ID ${id}:`, error);
    throw error;
  }
};

export const deleteCenter = async (id) => {
  try {
    const response = await axios.delete(`${CENTERS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting center with ID ${id}:`, error);
    throw error;
  }
};
