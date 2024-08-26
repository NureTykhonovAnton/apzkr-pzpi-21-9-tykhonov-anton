import React, { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage a WebSocket connection.
 * 
 * @returns {Object} An object containing functions to send messages, check user location, 
 *                   and state values such as `isConnected`, `error`, and `warning`.
 * 
 * @example
 * const { sendMessage, checkUserLocation, isConnected, error, warning } = useWebSocket();
 */
const useWebSocket = () => {
  const url = 'ws://localhost:5000';
  const [ws, setWs] = useState(null); // WebSocket instance
  const [isConnected, setIsConnected] = useState(false); // WebSocket connection status
  const [error, setError] = useState(null); // Stores any error that occurs
  const [warning, setWarning] = useState({ open: false, message: '' }); // Warning state for proximity or other messages

  // Effect to establish WebSocket connection on component mount
  useEffect(() => {
    const socket = new WebSocket(url);

    // Handle successful connection
    socket.onopen = () => {
      console.log('WebSocket connection established');
      setWs(socket);
      setIsConnected(true);
    };

    // Handle errors
    socket.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError(event);
    };

    // Handle incoming messages
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'warning' || data.type === 'proximityToCenter') {
        setWarning({ open: true, message: data.message });
      }
    };

    // Handle connection close
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      setWs(null);
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [url]); // Re-run this effect only if the URL changes

  /**
   * Sends a message through the WebSocket connection.
   *
   * @param {Object} message - The message to send.
   */
  const sendMessage = useCallback(
    (message) => {
      if (ws && isConnected) {
        ws.send(JSON.stringify(message));
        console.log('Message sent:', message);
      } else {
        console.error('WebSocket is not connected');
      }
    },
    [ws, isConnected] // Dependencies for useCallback
  );

  /**
   * Sends a request to check a user's location by their user ID.
   *
   * @param {string|number} userId - The ID of the user whose location should be checked.
   */
  const checkUserLocation = useCallback(
    (userId) => {
      if (ws && isConnected) {
        const message = {
          type: 'checkUserZone',
          userId: userId,
        };
        sendMessage(message);
      } else {
        console.error('WebSocket is not connected');
      }
    },
    [ws, isConnected, sendMessage] // Dependencies for useCallback
  );

  // Return WebSocket functionalities and states
  return { sendMessage, checkUserLocation, isConnected, error, warning };
};

export default useWebSocket;
