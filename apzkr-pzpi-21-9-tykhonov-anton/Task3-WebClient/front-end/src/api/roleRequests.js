// roleRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const ROLES_API_URL = `${API_BASE_URL}/roles`;

export const fetchRoles = async () => {
  try {
    const response = await axios.get(ROLES_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const createRole = async (role) => {
  try {
    const response = await axios.post(ROLES_API_URL, role);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const getRoleById = async (id) => {
  try {
    const response = await axios.get(`${ROLES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching role with ID ${id}:`, error);
    throw error;
  }
};

export const updateRole = async (id, role) => {
  try {
    const response = await axios.put(`${ROLES_API_URL}/${id}`, role);
    return response.data;
  } catch (error) {
    console.error(`Error updating role with ID ${id}:`, error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await axios.delete(`${ROLES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting role with ID ${id}:`, error);
    throw error;
  }
};
