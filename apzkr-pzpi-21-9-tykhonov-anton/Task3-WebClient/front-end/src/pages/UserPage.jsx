import React, { useState } from 'react';
import { Container, Box, styled } from '@mui/material';
import MapViewComponent from '../components/MapViewComponent.jsx';
import EvacuationCenters from '../components/EvacuationCentersVerticalTableComponent';
import EmergencyManagementComponent from '../components/EmergencyManagementComponent';
import TransportationVehicleManagementComponent from '../components/TransportationVehicleManagementComponent';
import { ThemeProvider, useTheme } from '../contexts/themeContext';
import ZonesCerticalTableComponent from '../components/ZonesCerticalTableComponent';
import { HereMapProvider } from '../contexts/hereMapContext';
import useGeolocation from '../utils/useGeolocation.js';

const UserPage = ({ currentComponent, setCurrentComponent, drawerOpen, toggleDrawer }) => {
  const theme = useTheme();
  const ThemedContainer = styled(Container)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  }));

  // CURRENT POSITION VARIABLES MUST BE DECLARED HERE AND PASSED DOWN TO OTHER COMPONENTS
  const { latitude, longitude } = useGeolocation(); // USER LOCATION


  const renderComponent = (currentComponent) => {
    switch (currentComponent) {
      case 'map':
        return (
          <Box display="flex" width="100%" sx={{ alignItems: 'center', p: 2 }}>
            <Box flex={2} mr={2}>
              <HereMapProvider>
                <div style={{ height: '100vh' }}>
                  <MapViewComponent latitude={latitude} longitude={longitude} />
                </div>
              </HereMapProvider>
            </Box>
            {/* <Box flex={1}>
              <EvacuationCenters />
              <ZonesCerticalTableComponent />
            </Box> */}
          </Box>
        );
      case 'emergency_management':
        return <EmergencyManagementComponent />;
      case 'transport':
        return <TransportationVehicleManagementComponent />;
      default:
        return (
          <Box display="flex" width="100%" sx={{ alignItems: 'center', p: 2 }}>
            <Box flex={2} mr={2}>
              <MapViewComponent latitude={latitude} longitude={longitude} />
            </Box>
            <Box flex={1}>
              <EvacuationCenters />
              <ZonesCerticalTableComponent />
            </Box>
          </Box>
        );
    }
  };

  return (
    <ThemeProvider>
      <ThemedContainer>
        <Box display="flex">
          <Box flexGrow={1}>
            {renderComponent(currentComponent)}
          </Box>
        </Box>
      </ThemedContainer>
    </ThemeProvider>
  );
};

export default UserPage;
