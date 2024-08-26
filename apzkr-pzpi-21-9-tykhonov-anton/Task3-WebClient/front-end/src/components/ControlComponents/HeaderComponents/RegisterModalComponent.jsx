import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUser } from '../../../api/userRequests';
import { useTranslation } from 'react-i18next';

const theme = createTheme();

const RegisterModal = ({ open, handleClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const {t} = useTranslation();

  const handleRegister = async () => {
    try {
      await createUser({ username:username, password:password, email:email });
      setError(null);
      setUsername('');
      setPassword('');
      setEmail('');
      handleClose();
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Error during registration. Please try again later.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('register')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('username')}
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
             <TextField
              fullWidth
              label={t('email')}
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label={t('password')}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            {error && (
              <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            {t('cancel')}
          </Button>
          <Button onClick={handleRegister} color="primary">
            {t('register')}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default RegisterModal;
