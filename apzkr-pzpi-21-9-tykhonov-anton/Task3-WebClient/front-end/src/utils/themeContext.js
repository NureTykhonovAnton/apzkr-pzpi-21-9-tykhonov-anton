import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Define your light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: "#e4f0e2",
    },
    text: {
      primary: "#000000",
    },
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiSelect: {
      defaultProps: {
        disableripple: "true",
      },
    },
    MuiMenuItem: {
      defaultProps: {
        disableripple: "true",
      },
    },
    FormControl: {
      defaultProps: {
        disableripple: "true",
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: "#222222",
    },
    text: {
      primary: "#ffffff",
    },
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
  components: {
    MuiSelect: {
      defaultProps: {
        disableripple: "true",
      },
    },
    MuiMenuItem: {
      defaultProps: {
        disableripple: "true",
      },
    },
    FormControl: {
      defaultProps: {
        disableripple: "true",
      },
    },
  },
});

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  // Load theme preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
