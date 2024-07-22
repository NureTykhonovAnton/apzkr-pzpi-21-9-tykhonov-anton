import React from 'react';
import { Button } from '@mui/material';
import { useTheme } from '../utils/themeContext';

const ThemeSwitcher = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme}>
      Mode {mode === 'light' ? 'Dark' : 'Light'}
    </Button>
  );
};

export default ThemeSwitcher;