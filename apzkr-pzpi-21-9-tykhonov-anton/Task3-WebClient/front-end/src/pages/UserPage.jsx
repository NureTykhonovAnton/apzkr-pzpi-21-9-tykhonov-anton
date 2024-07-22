import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import MapComponent from '../components/MapComponent';
import { useTheme } from '../utils/themeContext';

const UserPage = () => {
  const { mode, toggleTheme } = useTheme();
  return (
    <Container>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          User Dashboard
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Welcome to your user dashboard. Here you can manage your profile and view your content.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Edit Profile
          </Button>
          <Button variant="contained" color="secondary">
            View Content
          </Button>
        </Box>
      </Box>
      <MapComponent/>
    </Container>
  );
};

export default UserPage;
