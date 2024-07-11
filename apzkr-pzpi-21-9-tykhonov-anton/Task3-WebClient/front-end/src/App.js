import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import WelcomePage from './pages/WelcomePage';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import Header from './components/Header';
import { AuthProvider } from './utils/authContext';

const App = () => {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/user-page" element={<UserPage />} />
            <Route path="/admin-page" element={<AdminPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
