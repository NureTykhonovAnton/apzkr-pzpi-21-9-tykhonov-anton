// axiosInstance.js

import axios from 'axios';
import { API_BASE_URL } from '../utils/config';

// Create an Axios instance with a predefined base URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Request interceptor to attach the authentication token to each request.
 *
 * @param {Object} config - The Axios request configuration object.
 * @returns {Object} The modified Axios request configuration object with the token attached.
 * @throws {Promise} Returns a rejected promise if an error occurs during the request setup.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');
    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Return the modified config object
    return config;
  },
  (error) => {
    // Return a rejected promise if an error occurs during the request setup
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle authentication errors (e.g., 401 Unauthorized).
 *
 * @param {Object} response - The Axios response object.
 * @returns {Object} The Axios response object if no errors occur.
 * @throws {Promise} Returns a rejected promise if an error occurs during the response handling.
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the response object if no errors occur
    return response;
  },
  (error) => {
    // Check if the error is due to an authentication issue
    if (error.response && error.response.status === 401) {
      // Remove the token from local storage
      localStorage.removeItem('token');
      // Redirect the user to the login page
      window.location.href = '/';
    }
    // Return a rejected promise if an error occurs during the response handling
    return Promise.reject(error);
  }
);

export default axiosInstance;
