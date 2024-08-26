import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Button, styled } from '@mui/material';
import { ThemeProvider, useTheme } from '../contexts/themeContext';
import UserManagementComponent from '../components/UserManagementComponent';
import ZoneManagementComponent from '../components/ZoneManagamentComponent';
import MapViewComponent from '../components/MapComponents/MapViewComponent';
import { HereMapProvider } from '../contexts/hereMapContext';
import useGeolocation from '../utils/useGeolocation.js';
import MapTabsComponent from '../components/MapComponents/MapTabsComponent.jsx';
import IoTDeviceManagementComponent from '../components/IotDeviceManagamentComponent.jsx';
import CenterManagementComponent from '../components/CentersManagamentComponent.jsx';
import EvacuationManagementComponent from '../components/EvacuationManagementComponent.jsx';
import UserProfileComponent from '../components/UserProfileComponent.jsx';
import EmergencyTypeManagementComponent from '../components/EmergencyTypeManagementComponent.jsx'
import WarningBanner from '../components/WarningBanner.jsx';
import useWebSocket from '../utils/useWebSocket.js';
import LogViewerComponent from '../components/LogViewerComponent.jsx';

const AdminPage = ({ currentComponent, setCurrentComponent, drawerOpen, toggleDrawer }) => {
  const theme = useTheme();
  const ThemedContainer = styled(Container)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  }));

  // Get user location and evacuation data
  const { latitude, longitude, evacuationData } = useGeolocation();
  const { sendMessage, warning } = useWebSocket();

  // State for selected destination, can be set manually or received from the server
  const [selectedDestination, setSelectedDestination] = useState(null);
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
      case 'users':
        return <UserManagementComponent />;
      case 'profile':
        return <UserProfileComponent />;
      case 'zones':
        return <ZoneManagementComponent />;
      case 'iot':
        return <IoTDeviceManagementComponent />;
      case 'centers':
        return <CenterManagementComponent />;
      case 'evacuations':
        return <EvacuationManagementComponent />;
      case 'emergency-types':
        return <EmergencyTypeManagementComponent/>
      case 'logViewer':
        return <LogViewerComponent />;
      default:
        return (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              Welcome to the admin panel. Here you can manage users and view system statistics.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => setCurrentComponent('users')}
              >
                Manage Users
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setCurrentComponent('map')}
              >
                View Map
              </Button>
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

export default AdminPage;
