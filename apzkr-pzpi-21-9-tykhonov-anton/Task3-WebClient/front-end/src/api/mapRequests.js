import axios from 'axios';
import { API_MAP_URL } from '../utils/config';

const MAP_API_URL = `${API_MAP_URL}/map`;

const fetchMapData = async (latitude, longitude) => {
  try {
    const response = await axios.post(MAP_API_URL, { latitude, longitude });
    return response.data;
  } catch (error) {
    console.error('Error fetching map data:', error);
    throw error;
  }
};

export default fetchMapData;


