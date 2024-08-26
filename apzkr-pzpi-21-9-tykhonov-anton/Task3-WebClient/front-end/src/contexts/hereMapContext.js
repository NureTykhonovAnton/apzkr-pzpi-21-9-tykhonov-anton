import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { hereMapLoader } from '../utils/hereMapLoader';
import useGeolocation from '../utils/useGeolocation.js';
import fetchMapData from '../api/mapRequests';

// Create a Context for the HERE Maps API
const HereMapContext = createContext(null);

/**
 * Provides HERE Maps API, platform, and map instance to child components.
 * 
 * This component initializes the HERE Maps API, sets up the map with default options,
 * and handles loading and error states. It uses the `useGeolocation` hook to center the map
 * based on the user's location if available.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components to be rendered.
 * 
 * @returns {React.ReactElement} - The provider component with HERE Maps API context.
 */
export const HereMapProvider = ({ children }) => {
  const [hereMap, setHereMap] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapContainerRef = useRef(null);

  // Get geolocation data from custom hook
  const { latitude, longitude, error: geoError } = useGeolocation();

  useEffect(() => {
    /**
     * Initializes the HERE Maps API and sets up the map instance.
     * Fetches the API key from the server and configures the map with
     * geolocation if available, or defaults to Berlin, Germany.
     * Handles errors in loading the HERE Maps API and fetching map data.
     * 
     * @async
     * @function
     */
    const initializeMap = async () => {
      try {
        setLoading(true);

        // Fetch API key and map data
        const mapData = await fetchMapData();
        const apiKey = mapData.apikey;

        if (!apiKey) {
          throw new Error('No API key returned from the server.');
        }

        // Load HERE Maps API
        const H = await hereMapLoader();
        if (!H || !H.service) {
          throw new Error('HERE Maps API failed to load.');
        }
        setHereMap(H);

        // Initialize HERE platform
        const platformInstance = new H.service.Platform({ apikey: apiKey });
        setPlatform(platformInstance);

        // Create default map options with geolocation if available
        const defaultMapOptions = {
          center: {
            lat: latitude || 52.520008, // Default to Berlin, Germany
            lng: longitude || 13.404954,
          },
          zoom: 10,
        };

        // Initialize the map if container is available
        if (mapContainerRef.current) {
          const mapInstance = new H.Map(
            mapContainerRef.current,
            platformInstance.createDefaultLayers().vector.normal.map,
            defaultMapOptions
          );
          setMap(mapInstance);

          // Enable map events
          new H.mapevents.Behavior(new H.mapevents.MapEvents(mapInstance));
          // Add default UI components like zoom control
          H.ui.UI.createDefault(mapInstance, platformInstance.createDefaultLayers());

          setLoading(false);
        }
      } catch (err) {
        console.error('Error initializing HERE Maps:', err);
        setError(err);
        setLoading(false);
      }
    };

    initializeMap();
  }, [latitude, longitude]);

  return (
    <HereMapContext.Provider value={{ hereMap, platform, map, loading, error }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }}>
        {loading && <div>Loading...</div>}
        {error && <div>Error loading HERE Maps API: {error.message}</div>}
      </div>
      {children}
    </HereMapContext.Provider>
  );
};

/**
 * Custom hook to access HERE Maps API context values.
 * 
 * Throws an error if used outside of a HereMapProvider.
 * 
 * @returns {Object} - The HERE Maps context values including the HERE Maps API,
 *                      platform, map instance, loading state, and any errors.
 * 
 * @throws {Error} - Throws an error if used outside of HereMapProvider.
 */
export const useHereMap = () => {
  const context = useContext(HereMapContext);
  if (context === undefined) {
    throw new Error('useHereMap must be used within a HereMapProvider');
  }
  return context;
};
