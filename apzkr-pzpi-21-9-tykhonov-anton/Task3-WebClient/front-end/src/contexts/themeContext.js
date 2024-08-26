import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CookiesProvider, useCookies } from 'react-cookie';

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

// Create a Context for managing the theme
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Using cookies to persist the theme mode
  const [cookies, setCookie] = useCookies(['themeMode']);
  const [mode, setMode] = useState(cookies.themeMode || 'light'); // Default to 'light' if no cookie is set

  // Update the cookie whenever the theme mode changes
  useEffect(() => {
    setCookie('themeMode', mode, {
      path: '/',
      expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000), // Cookie expires in 1 year
    });
  }, [mode, setCookie]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Select the appropriate theme based on the current mode
  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <CookiesProvider>
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
        <MuiThemeProvider theme={theme}>
          {children}
        </MuiThemeProvider>
      </ThemeContext.Provider>
    </CookiesProvider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
