import { useState, useEffect } from 'react';

// Custom hook to handle geolocation
const useGeolocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to handle geolocation success
    const handleSuccess = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    // Function to handle geolocation error
    const handleError = (error) => {
      console.error('Geolocation error:', error);
      setError(error);
    };

    // Function to start watching position
    const startTracking = () => {
      if (navigator.geolocation) {
        // Fetch initial position
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          handleError
        );

        // Watch for continuous position updates
        const watchId = navigator.geolocation.watchPosition(
          handleSuccess,
          handleError
        );

        return watchId;
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    // Start tracking on mount
    const watchId = startTracking();

    // Cleanup on unmount
    return () => {
      if (navigator.geolocation && watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return { latitude, longitude, error };
};

export default useGeolocation;