import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import useWebSocket from './useWebSocket';
import { getEvacuationByUserId } from '../api/evacuationRequests';

/**
 * Custom hook to handle user geolocation, WebSocket communication, and fetching evacuation data.
 *
 * @returns {Object} Contains the latitude, longitude, evacuation data, and any error encountered.
 *
 * @example
 * const { latitude, longitude, evacuationData, error } = useGeolocation();
 */
const useGeolocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [evacuationData, setEvacuationData] = useState(null);
  const [error, setError] = useState(null);
  const { sendMessage, isConnected } = useWebSocket();
  const { user } = useAuth();

  /**
   * Success callback for geolocation API.
   * Updates the state with the current position.
   *
   * @param {GeolocationPosition} position - The geolocation position object containing coordinates.
   */
  const handleSuccess = (position) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  };

  /**
   * Error callback for geolocation API.
   * Logs the error and updates the state with the error message.
   *
   * @param {GeolocationPositionError} error - The error object provided by the geolocation API.
   */
  const handleError = (error) => {
    console.error('Geolocation error:', error);
    setError(error.message); // Store error message in the state
  };

  /**
   * Starts tracking the user's location using the browser's geolocation API.
   * Fetches the initial position and watches for continuous updates.
   *
   * @returns {number|null} The ID of the geolocation watch, or null if geolocation is not supported.
   */
  const startTracking = () => {
    if (navigator.geolocation) {
      // Fetch initial position
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);

      // Watch for continuous position updates
      return navigator.geolocation.watchPosition(handleSuccess, handleError);
    } else {
      const errorMsg = 'Geolocation is not supported by this browser.';
      console.error(errorMsg);
      setError(errorMsg);
      return null;
    }
  };

  // Setup geolocation tracking on mount and cleanup on unmount
  useEffect(() => {
    const watchId = startTracking();
    return () => {
      if (navigator.geolocation && watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  /**
   * Sends location updates via WebSocket whenever the latitude or longitude changes.
   */
  useEffect(() => {
    if (isConnected && latitude !== null && longitude !== null) {
      sendMessage({
        type: 'userLocationUpdate',
        data: {
          userId: user.id,
          latitude,
          longitude,
        },
      });
    }
  }, [latitude, longitude, isConnected, sendMessage, user.id]);

  /**
   * Fetches evacuation data for the current user based on their ID.
   * The data is fetched only when the user ID is available.
   */
  useEffect(() => {
    const fetchEvacuationData = async () => {
      try {
        const evacResponse = await getEvacuationByUserId(user.id);
        setEvacuationData(evacResponse);
        console.log("Evacuation received and set:", evacResponse);
      } catch (error) {
        console.error('Error fetching evacuation data:', error);
      }
    };

    if (user.id) {
      fetchEvacuationData();
    }
  }, [user.id]);

  return { latitude, longitude, evacuationData, error };
};

export default useGeolocation;
