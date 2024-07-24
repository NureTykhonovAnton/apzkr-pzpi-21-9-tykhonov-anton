// UserPage.js
import React from 'react';
import { Container, Box, styled  } from '@mui/material';
import MapComponent from '../components/MapComponent';
import EvacuationCenters from '../components/EvacuationCentersVerticalTableComponent';
import EmergencyManagementComponent from '../components/EmergencyManagementComponent';
import TransportationVehicleManagementComponent from '../components/TransportTypeManagementComponent'
import { ThemeProvider, useTheme } from '../utils/themeContext';
import ZonesCerticalTableComponent from '../components/ZonesCerticalTableComponent';
const UserPage = ({ currentComponent, setCurrentComponent, drawerOpen, toggleDrawer }) => {
  const theme = useTheme();
  const ThemedContainer = styled(Container)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  }));

  const renderComponent = (currentComponent) => {
    switch (currentComponent) {
      case 'map':
        return (
          <Box display="flex" width="100%" sx={{alignItems: 'center', p:2 }}>
            <Box flex={2} mr={2} > {/* Adjust the flex value and margin as needed */}
              <MapComponent />
            </Box>
            <Box flex={1}> {/* Adjust the flex value as needed */}
              <EvacuationCenters />
              <ZonesCerticalTableComponent/>
            </Box>
          </Box>
        );
      case 'emergency_management':
        return <EmergencyManagementComponent />;
      case 'transport':
        return <TransportationVehicleManagementComponent />;
      default:
        return <MapComponent />;
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
