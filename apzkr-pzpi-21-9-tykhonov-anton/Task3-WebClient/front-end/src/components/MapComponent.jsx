import React, { useEffect, useState } from 'react';
import { hereMapLoader } from '../utils/hereMapLoader';
import fetchMapData from '../api/mapRequests';

const MapComponent = ({ longitude, latitude }) => {
  const [mapConfig, setMapConfig] = useState(null);
  const [map, setMap] = useState(null);
  const [mode, setMode] = useState('marker'); // 'marker' or 'circle'
  const [route, setRoute] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [platform, setPlatform] = useState(null); // Store the platform instance
  const [routeLength, setRouteLength] = useState(null); // State to store the route length

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

  const addMarker = (H, map, lat, lng) => {
    const marker = new H.map.Marker({ lat, lng });
    map.addObject(marker);
    map.setCenter({ lat, lng });

    return marker;
  };

  const addCircleToMap = (H, map, lat, lng) => {
    map.addObject(new H.map.Circle(
      { lat, lng },
      1000,
      {
        style: {
          strokeColor: 'rgba(0, 0, 0, 0.5)',
          lineWidth: 2,
          fillColor: 'rgba(255, 0, 0, 0.3)'
        }
      }
    ));
  };

  const calculateRoute = (H, map, platform, start, end) => {
    if (!start || !end) {
      console.error('Start or end point is undefined');
      return;
    }

    const router = platform.getRoutingService(null, 8);
    const routingParameters = {
      'routingMode': 'fast',
      'transportMode': 'car',
      'origin': `${start.lat},${start.lng}`,
      'destination': `${end.lat},${end.lng}`,
      'return': 'polyline',
    };

    const onResult = (result) => {
      if (result.routes && result.routes.length > 0) {
        const route = result.routes[0];
        if (route.sections && route.sections.length > 0) {
          const lineStrings = [];
          route.sections.forEach((section) => {
            lineStrings.push(H.geo.LineString.fromFlexiblePolyline(section.polyline));
          });

          const multiLineString = new H.geo.MultiLineString(lineStrings);

          const routeBackground = new H.map.Polyline(multiLineString, {
            style: {
              lineWidth: 6,
              strokeColor: 'rgba(0, 128, 255, 0.7)',
              lineTailCap: 'arrow-tail',
              lineHeadCap: 'arrow-head'
            }
          });
          const routeArrows = new H.map.Polyline(multiLineString, {
            style: {
              lineWidth: 6,
              fillColor: 'white',
              strokeColor: 'rgba(255, 255, 255, 1)',
              lineDash: [0, 2],
              lineTailCap: 'arrow-tail',
              lineHeadCap: 'arrow-head'
            }
          });

          const startMarker = new H.map.Marker(start);
          const endMarker = new H.map.Marker(end);

          const group = new H.map.Group();
          group.addObjects([routeBackground, routeArrows, startMarker, endMarker]);
          map.addObject(group);

          map.getViewModel().setLookAtData({
            bounds: group.getBoundingBox()
          });

          const routeLength = route.sections.reduce((acc, section) => acc + section.travelSummary.length, 0) / 1000;
          setRouteLength(routeLength); // Convert meters to kilometers
          setRoute(route);
        } else {
          console.error('No sections found in the route');
        }
      } else {
        console.error('No route found in the response');
      }
    };

    router.calculateRoute(routingParameters, onResult, (error) => {
      console.error('Error calculating route:', error);
    });
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

          const platformInstance = new H.service.Platform({
            apikey: mapConfig.apikey
          });
          setPlatform(platformInstance); // Store the platform instance

          const defaultLayers = platformInstance.createDefaultLayers();
          console.log('Platform and defaultLayers created:', platformInstance, defaultLayers); // Debugging statement

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

          new H.mapevents.Behavior(new H.mapevents.MapEvents(mapInstance));
          H.ui.UI.createDefault(mapInstance, defaultLayers);

          const initialMarker = addMarker(H, mapInstance, mapConfig.latitude, mapConfig.longitude);

          setMap(mapInstance);
          setMarkers([initialMarker]);

          setUpClickListener(H, mapInstance);
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      }
    };

    initializeMap();
  }, [mapConfig]);

  useEffect(() => {
    if (map && markers.length === 2 && platform) {
      const start = markers[0].getGeometry();
      const end = markers[1].getGeometry();
      calculateRoute(window.H, map, platform, start, end);
    }
  }, [map, markers, platform]);

  const setUpClickListener = (H, map) => {
    map.addEventListener('tap', function (evt) {
      const coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
      console.log('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
        ((coord.lat > 0) ? 'N' : 'S') + ' ' +
        Math.abs(coord.lng.toFixed(4)) +
        ((coord.lng > 0) ? 'E' : 'W'));

      if (mode === 'marker') {
        const newMarker = addMarker(H, map, coord.lat, coord.lng);
        setMarkers(prevMarkers => {
          const updatedMarkers = [...prevMarkers, newMarker];
          if (updatedMarkers.length > 2) updatedMarkers.shift(); // Keep only the latest 2 markers
          return updatedMarkers;
        });
      } else if (mode === 'circle') {
        addCircleToMap(H, map, coord.lat, coord.lng);
      }
    });
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  return (
    <div>
      <div>
        <label>
          <input 
            type="radio" 
            value="marker" 
            checked={mode === 'marker'} 
            onChange={handleModeChange} 
          />
          Add Marker
        </label>
        <label>
          <input 
            type="radio" 
            value="circle" 
            checked={mode === 'circle'} 
            onChange={handleModeChange} 
          />
          Draw Circle
        </label>
      </div>
      <div
        id="map"
        style={{
          width: '100%',
          height: '500px',
          background: 'grey',
          position: 'relative'
        }}
      />
      {routeLength !== null && <p>Route length: {routeLength} km</p>} {/* Display route length */}
    </div>
  );
};

export default MapComponent;
