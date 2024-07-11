// routeRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const ROUTES_API_URL = `${API_BASE_URL}/routes`;

export const fetchRoutes = async () => {
  try {
    const response = await axios.get(ROUTES_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

export const createRoute = async (route) => {
  try {
    const response = await axios.post(ROUTES_API_URL, route);
    return response.data;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
};

export const getRouteById = async (id) => {
  try {
    const response = await axios.get(`${ROUTES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching route with ID ${id}:`, error);
    throw error;
  }
};

export const updateRoute = async (id, route) => {
  try {
    const response = await axios.put(`${ROUTES_API_URL}/${id}`, route);
    return response.data;
  } catch (error) {
    console.error(`Error updating route with ID ${id}:`, error);
    throw error;
  }
};

export const deleteRoute = async (id) => {
  try {
    const response = await axios.delete(`${ROUTES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting route with ID ${id}:`, error);
    throw error;
  }
};
