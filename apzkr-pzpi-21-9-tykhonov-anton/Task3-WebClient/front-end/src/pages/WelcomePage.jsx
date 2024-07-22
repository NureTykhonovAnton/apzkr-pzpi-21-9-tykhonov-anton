import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
const WelcomePage = () => {
  return (
    <Container>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to My App
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Your journey starts here.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" href="/">
            Get Started
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default WelcomePage;
