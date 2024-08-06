// transportationVehicleRequest.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

const TRANSPORTATION_VEHICLES_API_URL = `${API_BASE_URL}/transportation-vehicles`;

export const fetchTransportationVehicles = async () => {
  try {
    const response = await axios.get(TRANSPORTATION_VEHICLES_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching transportation vehicles:', error);
    throw error;
  }
};

export const createTransportationVehicle = async (vehicle) => {
  try {
    const response = await axios.post(TRANSPORTATION_VEHICLES_API_URL, vehicle);
    return response.data;
  } catch (error) {
    console.error('Error creating transportation vehicle:', error);
    throw error;
  }
};
export const getTransportByUserId = async (userId) =>{
  try{
    const response = await axios.get(TRANSPORTATION_VEHICLES_API_URL,`/users/${userId}`);
    return response.data;
  }catch(error){
    console.error(`Error getting transportation vehicle based on user id ${userId}:`, error);
    throw error;
  }
}

export const getTransportationVehicleById = async (id) => {
  try {
    const response = await axios.get(`${TRANSPORTATION_VEHICLES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transportation vehicle with ID ${id}:`, error);
    throw error;
  }
};

export const updateTransportationVehicle = async (id, vehicle) => {
  try {
    const response = await axios.put(`${TRANSPORTATION_VEHICLES_API_URL}/${id}`, vehicle);
    return response.data;
  } catch (error) {
    console.error(`Error updating transportation vehicle with ID ${id}:`, error);
    throw error;
  }
};

export const deleteTransportationVehicle = async (id) => {
  try {
    const response = await axios.delete(`${TRANSPORTATION_VEHICLES_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting transportation vehicle with ID ${id}:`, error);
    throw error;
  }
};
