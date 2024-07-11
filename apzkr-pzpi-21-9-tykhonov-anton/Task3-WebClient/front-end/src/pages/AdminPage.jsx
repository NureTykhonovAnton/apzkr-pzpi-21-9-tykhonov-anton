import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

const AdminPage = () => {
  return (
    <Container>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Welcome to the admin panel. Here you can manage users and view system statistics.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Manage Users
          </Button>
          <Button variant="contained" color="secondary">
            View Statistics
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AdminPage;
