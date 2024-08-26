// api/userRequests.js
import { API_BASE_URL } from '../utils/config';
import axiosInstance from './index';

const API_USERS = API_BASE_URL +'/users'

// Создание нового пользователя
export const createUser = async (userData) => {
  try {
    const Udata = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      img: userData.img || "",
      role: userData.role || "user",
    };
    const response = await axiosInstance.post(API_USERS, Udata);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Получение всех пользователей
export const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get(API_USERS);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Обновление пользователя
export const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`${API_USERS}/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Удаление пользователя
export const deleteUser = async (id) => {
  try {
    await axiosInstance.delete(`${API_USERS}/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Логин пользователя
export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post(`${API_USERS}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchUserData = async (token) => {
  try {
    token = localStorage.getItem('token')
    console.log('Fetch user data initiated at:', new Date().toISOString());
    const response = await axiosInstance.get(`${API_USERS}/data`, {
      headers: {
        Authorization: `Bearer ${token}`.toString()
      }
    });
    console.log('Received user from backend at:', new Date().toISOString());
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Получение пользователя по ID
export const fetchUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_USERS}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error.response ? error.response.data : error.message);
    throw error;
  }
};
