import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { hereMapLoader } from '../utils/hereMapLoader';
import  useGeolocation  from '../utils/useGeolocation.js';
import fetchMapData from '../api/mapRequests';

// Create a Context for the HERE Maps API
const HereMapContext = createContext(null);

// Create a provider component
export const HereMapProvider = ({ children }) => {
  const [hereMap, setHereMap] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapContainerRef = useRef(null);

  const { latitude, longitude, error: geoError } = useGeolocation();

  useEffect(() => {
    const initializeMap = async () => {
      try {
        setLoading(true);
        const mapData = await fetchMapData(); // Fetch API key and other data
        const apiKey = mapData.apikey;
        
        if(!apiKey) console.log('No API key returned from the server.')

        const H = await hereMapLoader();
        setHereMap(H);

        // Initialize the HERE platform
        const platformInstance = new H.service.Platform({
          apikey: apiKey,
        });
        setPlatform(platformInstance);

        // Create default map options, using geolocation if available
        const defaultMapOptions = {
          center: {
            lat: latitude || 52.520008, // Berlin, Germany as default
            lng: longitude || 13.404954,
          },
          zoom: 10,
        };

        // Initialize the map
        if (mapContainerRef.current) {
          const mapInstance = new H.Map(
            mapContainerRef.current,
            platformInstance.createDefaultLayers().vector.normal.map,
            defaultMapOptions
          );
          setMap(mapInstance);

          // Enable map events
          new H.mapevents.Behavior(new H.mapevents.MapEvents(mapInstance));
          // Add UI components like zoom control
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

  useEffect(() => {
    if (geoError) {
      setError(geoError);
      setLoading(false);
    }
  }, [geoError]);

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

// Create a custom hook to use the HereMapContext
export const useHereMap = () => {
  const context = useContext(HereMapContext);
  if (context === undefined) {
    throw new Error('useHereMap must be used within a HereMapProvider');
  }
  return context;
};
