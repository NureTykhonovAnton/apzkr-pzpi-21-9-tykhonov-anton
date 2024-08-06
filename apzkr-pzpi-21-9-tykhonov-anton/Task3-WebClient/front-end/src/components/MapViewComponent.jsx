import React, { useEffect, useState, useCallback } from 'react';
import fetchMapData from '../api/mapRequests';
import { calculateRouteLength } from '../utils/calculateRoute';
import { useTranslation } from 'react-i18next';
import { useUnit } from '../contexts/unitContext';
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  TextField
} from '@mui/material';
import { fetchZones } from '../api/zoneRequests';
import { fetchCenters } from '../api/centerRequests';
import { useHereMap } from '../contexts/hereMapContext';

const MapViewComponent = ({ latitude, longitude }) => {
  const { t } = useTranslation();
  const { unit, convertDistance } = useUnit();
  const [mapConfig, setMapConfig] = useState(null);
  const [map, setMap] = useState(null);
  const [mode, setMode] = useState('marker');
  // EXCESS VARIABLES
  const [route, setRoute] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [routeLength, setRouteLength] = useState(null);
  const [evacuationCenters, setEvacuationCenters] = useState([]);
  const [zones, setZones] = useState([]);
  // ***
  const [mousePosition, setMousePosition] = useState({ lat: null, lng: null });

  const { platform, hereMap } = useHereMap(); // Access the HERE Map context

  useEffect(() => {
    const fetchMapConfig = async () => {
      try {
        const response = await fetchMapData(latitude, longitude);
        console.log('Map data received from backend:', response);
        setMapConfig(response);
      } catch (error) {
        console.error('Error fetching map config:', error);
      }
    };
    if (latitude && longitude) {
      fetchMapConfig();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    const fetchEvacuationCenters = async () => {
      try {
        const response = await fetchCenters();
        setEvacuationCenters(response);
      } catch (error) {
        console.error('Error fetching evacuation centers:', error);
      }
    };

    const fetchEmergencyZones = async () => {
      try {
        const response = await fetchZones();
        setZones(response);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };

    fetchEvacuationCenters();
    fetchEmergencyZones();
  }, [latitude, longitude]);

  const addMarkerToMap = useCallback((hereMap, map, lat, lng) => {
    const marker = new hereMap.map.Marker({ lat, lng });
    map.addObject(marker);
    map.setCenter({ lat, lng });
    return marker;
  }, []);

  const addCircleToMap = useCallback((hereMap, map, lat, lng, radius = 1000) => {
    const circle = new hereMap.map.Circle(
      { lat, lng },
      radius,
      {
        style: {
          strokeColor: 'rgba(0, 0, 0, 0.5)',
          lineWidth: 2,
          fillColor: 'rgba(255, 0, 0, 0.3)'
        }
      }
    );
    map.addObject(circle);
  }, []);

  const setUpClickListener = useCallback((hereMap, map) => {
    const clickListener = (evt) => {
      const coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
      if (mode === 'marker') {
        addMarkerToMap(hereMap, map, coord.lat, coord.lng);
      } else if (mode === 'circle') {
        addCircleToMap(hereMap, map, coord.lat, coord.lng);
      }
    };

    map.removeEventListener('tap', clickListener);
    map.addEventListener('tap', clickListener);
  }, [mode, addMarkerToMap, addCircleToMap]);

  useEffect(() => {
    if (!map && mapConfig) {
      if (hereMap && platform) {
        const defaultLayers = platform.createDefaultLayers();

        const mapInstance = new hereMap.Map(
          document.getElementById('map'),
          defaultLayers.vector.normal.map,
          {
            center: { lat: latitude, lng: longitude },
            zoom: mapConfig.zoom,
            pixelRatio: window.devicePixelRatio || 1
          }
        );

        window.addEventListener('resize', () => mapInstance.getViewPort().resize());

        new hereMap.mapevents.Behavior(new hereMap.mapevents.MapEvents(mapInstance));
        hereMap.ui.UI.createDefault(mapInstance, defaultLayers);

        const initialMarker = addMarkerToMap(hereMap, mapInstance, latitude, longitude);
        setMap(mapInstance);
        setMarkers([initialMarker]);

        setUpHoverListener(hereMap, mapInstance);
        setUpClickListener(hereMap, mapInstance);
      }
    }
  }, [mapConfig, latitude, longitude, addMarkerToMap, setUpClickListener, map, hereMap, platform]);

  const calculateRoute = useCallback(async (hereMap, map, platform, start, end) => {
    if (!start || !end) return;

    const router = platform.getRoutingService(null, 8);
    const routingParameters = {
      routingMode: 'fast',
      transportMode: 'car',
      origin: `${start.lat},${start.lng}`,
      destination: `${end.lat},${end.lng}`,
      return: 'polyline'
    };

    const onResult = (result) => {
      if (result.routes && result.routes.length > 0) {
        const route = result.routes[0];
        if (route.sections && route.sections.length > 0) {
          const lineStrings = route.sections.map(section =>
            hereMap.geo.LineString.fromFlexiblePolyline(section.polyline)
          );

          const lines = lineStrings.map(lineString => new hereMap.map.Polyline(lineString, {
            style: { strokeColor: 'blue', lineWidth: 5 }
          }));

          lines.forEach(line => map.addObject(line));

          const routeLengthMeters = calculateRouteLength(route);
          setRouteLength(convertDistance(routeLengthMeters, 'm', unit));
        }
      }
    };

    const onError = (error) => {
      console.error('Error calculating route:', error);
    };

    router.calculateRoute(routingParameters, onResult, onError);
  }, [convertDistance, unit]);

  const setUpHoverListener = useCallback((H, map) => {
    const moveListener = (evt) => {
      const coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
      setMousePosition({ lat: coord.lat, lng: coord.lng });
    };

    map.removeEventListener('pointermove', moveListener);
    map.addEventListener('pointermove', moveListener);
  }, []);

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <TextField
          label={t('mouse_position')}
          value={`${mousePosition.lat?.toFixed(6)}, ${mousePosition.lng?.toFixed(6)}`}
          variant="outlined"
          size="small"
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">{t('mode')}</FormLabel>
          <RadioGroup row value={mode} onChange={handleModeChange}>
            <FormControlLabel value="marker" control={<Radio />} label={t('marker')} />
            <FormControlLabel value="circle" control={<Radio />} label={t('circle')} />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box id="map" style={{ height: '500px', width: '100%' }} />
    </div>
  );
};

export default MapViewComponent;
