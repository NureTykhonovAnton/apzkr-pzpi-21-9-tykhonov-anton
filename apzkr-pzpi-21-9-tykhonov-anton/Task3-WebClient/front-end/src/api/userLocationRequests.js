// userLocationRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const USER_LOCATIONS_API_URL = `${API_BASE_URL}/user-locations`;

export const fetchUserLocations = async () => {
  try {
    const response = await axios.get(USER_LOCATIONS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching user locations:', error);
    throw error;
  }
};

export const createUserLocation = async (location) => {
  try {
    const response = await axios.post(USER_LOCATIONS_API_URL, location);
    return response.data;
  } catch (error) {
    console.error('Error creating user location:', error);
    throw error;
  }
};

export const getUserLocationById = async (id) => {
  try {
    const response = await axios.get(`${USER_LOCATIONS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user location with ID ${id}:`, error);
    throw error;
  }
};

export const updateUserLocation = async (id, location) => {
  try {
    const response = await axios.put(`${USER_LOCATIONS_API_URL}/${id}`, location);
    return response.data;
  } catch (error) {
    console.error(`Error updating user location with ID ${id}:`, error);
    throw error;
  }
};

export const deleteUserLocation = async (id) => {
  try {
    const response = await axios.delete(`${USER_LOCATIONS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user location with ID ${id}:`, error);
    throw error;
  }
};
