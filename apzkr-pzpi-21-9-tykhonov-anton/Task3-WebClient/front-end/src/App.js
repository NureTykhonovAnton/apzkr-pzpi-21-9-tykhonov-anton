import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import Header from './components/Header';
import CookieBanner from './components/CookieBanner';
import { AuthProvider } from './utils/authContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './utils/i18n';
import { UnitProvider } from './utils/unitContext';
import { ThemeProvider } from './utils/themeContext';

const App = () => {
  const [currentComponent, setCurrentComponent] = useState('map');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };


  return (
    <I18nextProvider i18n={i18n}>
      <UnitProvider>
        <CookieBanner />
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <Header setCurrentComponent={setCurrentComponent} drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
              <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/user-page" element={<UserPage currentComponent={currentComponent} setCurrentComponent={setCurrentComponent} drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />} />
                <Route path="/admin-page" element={<AdminPage />} />
              </Routes>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </UnitProvider>
    </I18nextProvider>
  );
};

export default App;
