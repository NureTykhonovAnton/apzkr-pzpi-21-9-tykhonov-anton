import React, { useEffect, useState, useCallback, useRef } from 'react';
import fetchMapData from '../../api/mapRequests';
import { useTranslation } from 'react-i18next';
import { useUnit } from '../../contexts/unitContext';
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
  TextField,
  Button
} from '@mui/material';
import { useHereMap } from '../../contexts/hereMapContext';
import useStaticLocations from '../../utils/useStaticMapLocations';
import { useAuth } from '../../contexts/authContext';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { saveMapViewToPDF } from '../../utils/saveToPDF';
import EmergencyModal from './MapSubmitionComponents/EmergencyModal';
import CenterModal from './MapSubmitionComponents/CenterModal';
import WarningBanner from '../WarningBanner';
import IoTDeviceModal from './MapSubmitionComponents/IoTDeviceModal';
import { createIotDevice } from '../../api/iotDeviceRequests';

const MapViewComponent = ({ latitude, longitude, routeData }) => {
  const { t } = useTranslation();
  const [mapConfig, setMapConfig] = useState(null);
  const [map, setMap] = useState(null);
  const [mode, setMode] = useState('marker');
  const { centers, zones, devices, defaultRadius, addCenter, addZone, addDevice } = useStaticLocations();
  const { user } = useAuth();

  // MODAL CALLS
  const [centerModalOpen, setCenterModalOpen] = useState(false);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [iotModalOpen, setIotModalOpen] = useState(false);
  const [warningBannerOpen, setWarningBannerOpen] = useState(false);
  // ***


  const mapContainerRef = useRef(null);


  const [mousePosition, setMousePosition] = useState({ lat: null, lng: null });

  const { platform, hereMap } = useHereMap();

  // Modal Handlers

  const handleZoneModalOpen = (latitude, longitude, onSubmit) => {
    setZoneModalOpen(true); // Assuming you have state to manage the modal's open/close status
  }

  const handleZoneSubmit = (zoneData) => {
    if (zoneData) {
      addZone(zoneData)
      renderZone(hereMap, map, zoneData);
    }
    setZoneModalOpen(false);
  };

  const handleCenterSubmit = (centerData) => {
    if (centerData) {
      addCenter(centerData)
      renderMarker(hereMap, map, { lat: centerData.latitude, lng: centerData.longitude }, 'center');
    }
    setCenterModalOpen(false);
  };
  const handleCenterModalOpen = () => {
    setCenterModalOpen(true);
  };
  const handleIoTModalOpen = () => {
    setIotModalOpen(true);
  }
  const handleIoTSubmit = (iotData) => {
    createIotDevice(iotData);
    renderMarker(hereMap, map, { lat: iotData.latitude, lng: iotData.longitude }, 'iot');
  }
  const handleWarningBannerOpen = () => {
    setWarningBannerOpen(true);
  };

  const handleWarningBannerClose = () => {
    setWarningBannerOpen(false);
  };

  const handleSavePDF = () => {
    if (mapContainerRef.current) {
      saveMapViewToPDF(mapContainerRef.current.id);
    }
  };

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


  const renderMarker = useCallback((hereMap, map, lat, lng, type) => {
    let iconUrl;

    switch (type) {
      case 'user':
        iconUrl = "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-512.png";
        break;
      case 'person':
        iconUrl = "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png";
        break;
      case 'transport':
        iconUrl = "https://cdn3.iconfinder.com/data/icons/glypho-shopping-and-ecommerce/64/truck-fast-delivery-speed-512.png";
        break;
      case 'center':
        iconUrl = "https://cdn1.iconfinder.com/data/icons/unicons-line-vol-4/24/home-alt-512.png";
        break;
      case 'unknown':
        iconUrl = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/help-512.png";
        break;
      case 'iot':
        iconUrl = "https://cdn3.iconfinder.com/data/icons/fluent-regular-24px-vol-4/24/ic_fluent_iot_24_regular-64.png";
        break;
      default:
        iconUrl = "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/help-512.png";
        break;
    }

    const icon = new hereMap.map.Icon(iconUrl, { size: { w: 32, h: 32 } }); // Adjust the size as needed
    const marker = new hereMap.map.Marker({ lat, lng }, { icon });

    map.addObject(marker);
    return marker;
  }, []);

  const renderZone = useCallback((hereMap, map, zone) => {
    console.log(zone)
    let zoneStyle = {};
    switch (zone.emergencyTypeId) {
      case 1:
        zoneStyle = {
          style: {
            strokeColor: 'rgba(0, 0, 0, 0.5)',
            lineWidth: 2,
            fillColor: 'rgba(255, 0, 0, 0.3)'
          }
        }
        break;
      case 2:
        zoneStyle = {
          style: {
            strokeColor: 'rgba(0, 0, 0, 0.5)',
            lineWidth: 2,
            fillColor: 'rgba(0, 0, 255, 0.3)'
          }
        }
        break;
      case 3:
        zoneStyle = {
          style: {
            strokeColor: 'rgba(0, 0, 0, 0.5)',
            lineWidth: 2,
            fillColor: 'rgba(200, 255, 255, 0.3)'
          }
        }
        break;
      default:
        zoneStyle = {
          style: {
            strokeColor: 'rgba(0, 0, 0, 0.5)',
            lineWidth: 2,
            fillColor: 'rgba(255, 255, 255, 0.3)'
          }
        }
        break;
    }
    const circle = new hereMap.map.Circle(
      { lat: zone.latitude, lng: zone.longitude },
      zone.radius ? zone.radius : defaultRadius,
      zoneStyle
    );

    map.addObject(circle);

  }, []);



  const setUpClickListener = useCallback(() => {
    if (!map || !hereMap) return;

    const clickListener = (evt) => {

      if (mode === 'marker') {
        handleCenterModalOpen(mousePosition.lat, mousePosition.lat, handleCenterSubmit);
      } else if (mode === 'circle') {
        handleZoneModalOpen(mousePosition.lat, mousePosition.lat, handleZoneSubmit)
      }
      else if (mode === 'iot') {
        handleIoTModalOpen(mousePosition.lat, mousePosition.lat, handleIoTSubmit)
      }
    };

    map.addEventListener('tap', clickListener);

    // Clean up event listener when mode changes or component unmounts
    return () => {
      map.removeEventListener('tap', clickListener);
    };
  }, [map, hereMap, mode, renderMarker, renderZone, handleZoneModalOpen]);

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

        const initialMarker = renderMarker(hereMap, mapInstance, latitude, longitude, 'user');
        setMap(mapInstance);


        setUpHoverListener(hereMap, mapInstance);
        setUpClickListener(hereMap, mapInstance);
      }
    }
  }, [mapConfig, latitude, longitude, centers, zones, setUpClickListener, map, hereMap, platform]);






  // Render centers
  useEffect(() => {
    if (map && centers.length > 0) {
      centers.forEach(center => {
        const marker = renderMarker(hereMap, map, center.latitude, center.longitude, 'center');
      });
      console.log("Center Data Rendered");
    }
  }, [map, centers, hereMap]);

  // Render zones
  useEffect(() => {
    if (map && zones.length > 0) {
      zones.forEach(zone => {
        const zoneObj = renderZone(hereMap, map, zone);
      });
      console.log("Zone Data Rendered");
    }
  }, [map, zones, hereMap]);

  
  // Render zones
  useEffect(() => {
    if (map && devices.length > 0) {
      devices.forEach(device => {
        const deviceObj = renderMarker(hereMap, map, device.latitude, device.longitude, 'iot');
      });
      console.log("Iot Data Rendered");
    }
  }, [map, devices, hereMap]);


  useEffect(() => {
    if (hereMap && map) {
      const cleanupClickListener = setUpClickListener(hereMap, map);
      return cleanupClickListener;
    }
  }, [hereMap, map, setUpClickListener]);


  const calculateRoute = useCallback(async (hereMap, map, platform, start, end) => {
    console.log('Starting route calculation');

    try {
      // Initialize routing service
      const router = platform.getRoutingService(null, 8);

      // Define routing parameters
      const routingParameters = {
        routingMode: 'fast',
        transportMode: 'car',
        origin: `${start.lat},${start.lng}`,
        destination: `${end.lat},${end.lng}`,
        return: 'polyline'
      };

      console.log('Routing parameters:', routingParameters);

      // Define result handler
      const onResult = (result) => {
        console.log('API result:', result);

        if (result.routes && result.routes.length > 0) {
          const route = result.routes[0];

          if (route.sections && route.sections.length > 0) {
            // Decode polyline and create polyline objects
            const lineStrings = route.sections.map(section =>
              hereMap.geo.LineString.fromFlexiblePolyline(section.polyline)
            );

            const lines = lineStrings.map(lineString => new hereMap.map.Polyline(lineString, {
              style: { strokeColor: 'blue', lineWidth: 5 }
            }));

            // Add polyline objects to the map
            lines.forEach(line => map.addObject(line));
          }
        }
      };

      // Define error handlercd 
      const onError = (error) => {
        console.error('Error calculating route:', error);
      };

      // Calculate the route
      router.calculateRoute(routingParameters, onResult, onError);
    } catch (error) {
      console.error('Error in calculateRoute function:', error);
    }
  }, [map, hereMap]);


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

  // ROUTEDATA USEEFFECT
  useEffect(() => {
    if (routeData && map) {
      // Check if evacData is present within routeData
      if (routeData.endCenter) {
        // Handle manually rewritten routeData scenario
        console.log('Manual route data detected:', routeData);
        calculateRoute(hereMap, map, platform,
          { lat: latitude, lng: longitude },
          { lat: routeData.endCenter.latitude, lng: routeData.endCenter.longitude }
        );

      } else if (routeData.radius) {
        // Handle evacData scenario
        console.log('Evacuation route data detected:', routeData);
        map.setCenter({ lat: routeData.latitude, lng: routeData.longitude }, true);
      }
      else {
        console.warn('Incomplete routeData:', routeData);
        // Handle cases where routeData is incomplete or invalid
      }
    }
  }, [routeData, latitude, longitude, map, hereMap, platform]);

  return (
    <div>
      <Box id="map" ref={mapContainerRef} style={{ height: '500px', width: '100%', display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        <Box sx={{ mb: 2, zIndex: 2, position: 'absolute', left: '78%', display: 'flex' }}>
          <Button onClick={handleSavePDF}>
            <PictureAsPdfIcon />
          </Button>
          <TextField
            value={`${mousePosition.lat?.toFixed(6)}, ${mousePosition.lng?.toFixed(6)}`}
            variant="standard"
            size="small"
            InputProps={{
              readOnly: true,
              disableUnderline: true,
            }}
            style={{
              backgroundColor: 'white',
              borderRadius: '0% 0% 0% 30%',
              padding: '0px 0px 0px 10px',
              color: '#000000',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, p: 2, zIndex: 2, position: 'absolute', backgroundColor: 'white', borderRadius: '0% 0% 25% 0%', color: 'black' }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">{t('add')}</FormLabel>
            <RadioGroup row value={mode} onChange={handleModeChange}>
              {user.role === 'admin' && (
                <>
                  <FormControlLabel value="marker" control={<Radio />} label={t('center')} />
                  <FormControlLabel value="iot" control={<Radio />} label={'IOT'} />
                </>
              )}
              <FormControlLabel value="circle" control={<Radio />} label={t('zone')} />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>


      <EmergencyModal
        open={zoneModalOpen}
        onClose={() => setZoneModalOpen(false)}
        zoneLatitude={mousePosition.lat}
        zoneLongitude={mousePosition.lng}
        addZone={addZone}
        onSubmit={handleZoneSubmit}
        defaultRadius={defaultRadius}
      />
      <CenterModal
        open={centerModalOpen}
        onClose={() => setCenterModalOpen(false)}
        centerLatitude={mousePosition.lat}
        centerLongitude={mousePosition.lng}
        addCenter={addCenter}
      />
      <IoTDeviceModal
        open={iotModalOpen}
        onClose={() => setIotModalOpen(false)}
        iotDeviceLatitude={mousePosition.lat}
        iotDeviceLongitude={mousePosition.lng}
        onSubmit={handleIoTSubmit}
        addDevice={addDevice}
      />
      <WarningBanner
        open={warningBannerOpen}
        onClose={handleWarningBannerClose}
      />

    </div>
  );
};

export default MapViewComponent;
