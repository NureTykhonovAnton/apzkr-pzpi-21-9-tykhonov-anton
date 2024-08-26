import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import Header from './components/ControlComponents/Header';
import CookieBanner from './components/CookieBanner';
import { AuthProvider } from './contexts/authContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './contexts/i18nContext';
import { UnitProvider } from './contexts/unitContext';
import { ThemeProvider } from './contexts/themeContext';
import MultiProvider from './contexts/multiProvider';

const App = () => {
  const [currentComponent, setCurrentComponent] = useState('map');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };


  return (
    <MultiProvider
      providers={[
        <I18nextProvider i18n={i18n} />,
        <UnitProvider />,
        <ThemeProvider/>
      ]}>
      <CookieBanner />
      <Router>
        <AuthProvider>
          <Header setCurrentComponent={setCurrentComponent} drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/user-page" element={<UserPage currentComponent={currentComponent} setCurrentComponent={setCurrentComponent} drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />} />
            <Route path="/admin-page" element={<AdminPage currentComponent={currentComponent} setCurrentComponent={setCurrentComponent} drawerOpen={drawerOpen} toggleDrawer={toggleDrawer}  />} />
          </Routes>
        </AuthProvider>
      </Router>
    </MultiProvider>
  );
};

export default App;
