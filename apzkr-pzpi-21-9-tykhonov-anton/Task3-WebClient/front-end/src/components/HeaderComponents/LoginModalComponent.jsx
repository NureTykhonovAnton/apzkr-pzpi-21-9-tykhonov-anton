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
import { loginUser } from '../../api/userRequests';



const LoginModal = ({ open, handleClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
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
            Cancel
          </Button>
          <Button onClick={handleLogin} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default LoginModal;
