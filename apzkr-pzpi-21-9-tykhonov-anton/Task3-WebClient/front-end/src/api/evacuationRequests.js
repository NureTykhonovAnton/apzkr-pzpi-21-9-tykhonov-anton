import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const EVACUATION_API_URL = `${API_BASE_URL}/evacuations`;

// Получить все эвакуации
export const fetchEvacuations = async () => {
  try {
    const response = await axios.get(EVACUATION_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching evacuation processes:', error);
    throw error;
  }
};

// Создать новую эвакуацию
export const createEvacuation = async (evacuation) => {
  try {
    const response = await axios.post(EVACUATION_API_URL, evacuation);
    return response.data;
  } catch (error) {
    console.error('Error creating evacuation process:', error);
    throw error;
  }
};

// Получить эвакуацию по ID
export const getEvacuationById = async (id) => {
  try {
    const response = await axios.get(`${EVACUATION_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching evacuation process with ID ${id}:`, error);
    throw error;
  }
};

// Обновить эвакуацию по ID
export const updateEvacuation = async (id, evacuation) => {
  try {
    const response = await axios.put(`${EVACUATION_API_URL}/${id}`, evacuation);
    return response.data;
  } catch (error) {
    console.error(`Error updating evacuation process with ID ${id}:`, error);
    throw error;
  }
};

// Удалить эвакуацию по ID
export const deleteEvacuation = async (id) => {
  try {
    const response = await axios.delete(`${EVACUATION_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting evacuation process with ID ${id}:`, error);
    throw error;
  }
};
