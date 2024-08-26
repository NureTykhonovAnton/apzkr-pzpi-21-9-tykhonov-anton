import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, styled } from '@mui/material';
import MapViewComponent from '../components/MapComponents/MapViewComponent.jsx';
import { ThemeProvider, useTheme } from '../contexts/themeContext';
import { HereMapProvider } from '../contexts/hereMapContext';
import useGeolocation from '../utils/useGeolocation.js';
import MapTabsComponent from '../components/MapComponents/MapTabsComponent.jsx';
import UserProfileComponent from '../components/UserProfileComponent.jsx';
import useWebSocket from '../utils/useWebSocket.js';
import WarningBanner from '../components/WarningBanner.jsx';

const UserPage = ({ currentComponent, setCurrentComponent, drawerOpen, toggleDrawer }) => {
  const theme = useTheme();
  const ThemedContainer = styled(Container)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  }));

  // Get user location and evacuation data
  const { latitude, longitude, evacuationData } = useGeolocation();

  // State for selected destination, can be set manually or received from the server
  const [selectedDestination, setSelectedDestination] = useState(null);
  const { sendMessage, warning } = useWebSocket();
  const [bannerOpen, setBannerOpen] = useState(false);


  // Update destination when evacuation data is available
  useEffect(() => {
    if (evacuationData && evacuationData.endCenter) {
      setSelectedDestination(evacuationData);
    }
  }, [evacuationData]);

  useEffect(() => {
    if (warning.open == true) {
      setBannerOpen(true);
    }
  }, [warning]);

  // Handle destination selection from MapTabsComponent
  const handleDestinationSelect = useCallback((destination) => {
    setSelectedDestination(destination);
    console.log('Selected destination:', destination);
  }, []);

  // Render the current component
  const renderComponent = () => {
    switch (currentComponent) {
      case 'map':
        return (
          <Box width="100%" sx={{ alignItems: 'center', p: 2 }}>
            <Box flex={2} mr={2}>
              <HereMapProvider>
                <div style={{ height: '100vh' }}>
                  <MapViewComponent
                    latitude={latitude}
                    longitude={longitude}
                    routeData={selectedDestination}
                  />
                  <MapTabsComponent
                    userLatitude={latitude}
                    userLongitude={longitude}
                    onDestinationSelect={handleDestinationSelect}
                  />
                </div>
              </HereMapProvider>
            </Box>
          </Box>
        );
      case 'profile':
        return <UserProfileComponent />;
      default:
        return (
          <Box display="flex" width="100%" sx={{ alignItems: 'center', p: 2 }}>
            <Box flex={2} mr={2}>
              <HereMapProvider>
                <div style={{ height: '100vh' }}>
                  <MapViewComponent latitude={latitude} longitude={longitude} />
                  <MapTabsComponent
                    userLatitude={latitude}
                    userLongitude={longitude}
                    onDestinationSelect={handleDestinationSelect}
                  />
                </div>
              </HereMapProvider>
            </Box>
          </Box>
        );
    }
  };

  return (
    <ThemeProvider>
      <ThemedContainer>
        {warning && (
          <WarningBanner
            open={bannerOpen}
            onClose={() => { setBannerOpen(false); }}
            onNo={() => { setBannerOpen(false); }}
            message={warning.message}
          />
        )}
        {renderComponent()}
      </ThemedContainer>
    </ThemeProvider>
  );
};

export default UserPage;
