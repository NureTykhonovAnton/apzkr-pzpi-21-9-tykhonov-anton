import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const WelcomePage = () => {
  const {t} = useTranslation();
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
        }}
      >
        <source src="https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/ruefkyi-il8e5psf4/videoblocks-digital-map_1_r_kii_ooh__b6472120ece941a83d15febfec2a69de__P360.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <Container
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          {t('welcome_to_app')}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
        {t('please_login')}
        </Typography>
      </Container>
    </Box>
  );
};

export default WelcomePage;
