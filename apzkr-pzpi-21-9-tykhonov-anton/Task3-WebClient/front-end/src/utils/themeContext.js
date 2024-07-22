import React, { createContext, useContext, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Define your light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiSelect: {
      defaultProps: {
        dissableripple: "true", // No more ripple, on the whole application 💣!
      },
    },
    MuiMenuItem: {
      defaultProps: {
        dissableripple: "true", // No more ripple, on the whole application 💣!
      },
    },
    FormControl: {
      defaultProps: {
        dissableripple: "true"
      }
    }
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiSelect: {
      defaultProps: {
        dissableripple: "true", // No more ripple, on the whole application 💣!
      },
    },
    MuiMenuItem: {
      defaultProps: {
        dissableripple: "true", // No more ripple, on the whole application 💣!
      },
    },
    FormControl: {
      defaultProps: {
        dissableripple: "true"
      }
    }
  },
});

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

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
