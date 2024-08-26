// logRequest.js

import axiosInstance from './index';
import { API_BASE_URL } from '../utils/config';

/**
 * Fetches logs from the server.
 *
 * This function sends a GET request to the `/logs` endpoint of the server to retrieve log data.
 *
 * @async
 * @function fetchLogs
 * @returns {Promise<Object>} A promise that resolves to the log data retrieved from the server.
 * @throws {Error} Throws an error if the request fails.
 */
export const fetchLogs = async () => {
    try {
        // Send a GET request to the /logs endpoint
        const response = await axiosInstance.get(`http://localhost:5000/logs`);
        // Return the log data from the response
        return response.data;
    } catch (error) {
        // Log the error to the console
        console.log('Error fetching logs:', error);
        // Rethrow the error to be handled by the caller
        throw error;
    }
};

/**
 * Backs up the database.
 *
 * This function sends a POST request to the `/api/backup` endpoint of the server to initiate a database backup.
 *
 * @async
 * @function backupDB
 * @returns {Promise<Object>} A promise that resolves to the response data indicating the backup status.
 * @throws {Error} Throws an error if the request fails.
 */
export const backupDB = async () => {
    try {
        // Send a POST request to the /api/backup endpoint
        const response = await axiosInstance.post(`http://localhost:5000/api/backup`);
        // Return the backup status from the response
        return response.data;
    } catch (error) {
        // Log the error to the console
        console.log('Error backing up DB:', error);
        // Rethrow the error to be handled by the caller
        throw error;
    }
};
