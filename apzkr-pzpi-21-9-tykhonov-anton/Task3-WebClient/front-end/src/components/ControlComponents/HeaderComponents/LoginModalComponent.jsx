import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  ThemeProvider,
} from '@mui/material';
import { loginUser } from '../../../api/userRequests';
import { useTranslation } from 'react-i18next';



const LoginModal = ({ open, handleClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const handleLogin = async () => {
    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      const data = await loginUser({ username, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        setError('');
        handleClose(); // Close the modal on successful login
        window.location.reload(); // Reload to fetch user data and update the header
      } else {
        setError('Invalid username or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Error during login. Please try again later.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t('login')}</DialogTitle>
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
        <Button onClick={handleLogin} color="primary">
          {t('login')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;
