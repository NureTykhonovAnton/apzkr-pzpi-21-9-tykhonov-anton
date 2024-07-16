import React, { useEffect, useState } from 'react';
import { hereMapLoader } from '../utils/hereMapLoader';
import fetchMapData from '../api/mapRequests';

const MapComponent = ({ longitude, latitude }) => {
  const [mapConfig, setMapConfig] = useState(null);
  const [map, setMap] = useState(null);

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

  const setUpClickListener = (H, map) => {
    map.addEventListener('tap', function (evt) {
      const coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
      console.log('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
        ((coord.lat > 0) ? 'N' : 'S') + ' ' +
        Math.abs(coord.lng.toFixed(4)) +
        ((coord.lng > 0) ? 'E' : 'W'));

      // Add a new marker at the clicked position
      addMarker(H, map, coord.lat, coord.lng);
    });
  };

  const addMarker = (H, map, lat, lng) => {
    const marker = new H.map.Marker({ lat, lng });
    map.addObject(marker);
    map.setCenter({ lat, lng });
  };

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

          const mapInstance = new H.Map(
            document.getElementById('map'),
            defaultLayers.vector.normal.map,
            {
              center: { lat: mapConfig.latitude, lng: mapConfig.longitude },
              zoom: mapConfig.zoom,
              pixelRatio: window.devicePixelRatio || 1
            }
          );

          console.log('Map created:', mapInstance); // Debugging statement

          window.addEventListener('resize', () => mapInstance.getViewPort().resize());

          const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(mapInstance));
          const ui = H.ui.UI.createDefault(mapInstance, defaultLayers);

          const LocationOfMarker = { lat: mapConfig.latitude, lng: mapConfig.longitude };

          // Path to the marker icon in the public directory
          const marker = new H.map.Marker(LocationOfMarker);
          mapInstance.addObject(marker);

          console.log('Marker added:', marker); // Debugging statement

          setMap(mapInstance);
          setUpClickListener(H, mapInstance);
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
