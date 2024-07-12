import React, { useEffect, useState } from 'react';
import { hereMapLoader } from '../utils/hereMapLoader';
import fetchMapData from '../api/mapRequests';

const MapComponent = ({ longitude, latitude }) => {
  const [mapConfig, setMapConfig] = useState(null);

  useEffect(() => {
    const fetchMapConfig = async () => {
      try {
        const response = await fetchMapData(latitude, longitude);
        console.log('Map data received from backend:', response); // Debugging message
        setMapConfig(response);
      } catch (error) {
        console.error('Error fetching map config:', error);
      }
    };

    fetchMapConfig();
  }, [latitude, longitude]);

  useEffect(() => {
    const initializeMap = async () => {
      if (mapConfig) {
        try {
          const H = await hereMapLoader();
          console.log('HERE Maps API loaded:', H); // Debugging statement

          if (!H || !H.service || !H.service.Platform) {
            throw new Error('HERE Maps API is not available');
          }

          const platform = new H.service.Platform({
            apikey: mapConfig.apikey
          });
          const defaultLayers = platform.createDefaultLayers();
          console.log('Platform and defaultLayers created:', platform, defaultLayers); // Debugging statement

          const map = new H.Map(
            document.getElementById('map'),
            defaultLayers.vector.normal.map,
            {
              center: { lat: mapConfig.latitude, lng: mapConfig.longitude },
              zoom: mapConfig.zoom,
              pixelRatio: window.devicePixelRatio || 1
            }
          );

          console.log('Map created:', map); // Debugging statement

          window.addEventListener('resize', () => map.getViewPort().resize());

          const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
          const ui = H.ui.UI.createDefault(map, defaultLayers);
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      }
    };

    initializeMap();
  }, [mapConfig]);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '500px',
        background: 'grey',
        position: 'relative'
      }}
    />
  );
};

export default MapComponent;
