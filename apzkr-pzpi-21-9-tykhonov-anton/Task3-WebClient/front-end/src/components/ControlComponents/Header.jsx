import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {AppBar, Toolbar, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RegisterModal from './HeaderComponents/RegisterModalComponent';
import LoginModal from './HeaderComponents/LoginModalComponent';
import { useAuth } from '../../contexts/authContext';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import HeaderSettingsMenu from './HeaderComponents/HeaderSettingsMenu';

const Header = ({ setCurrentComponent }) => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleRegisterOpen = () => {
    setRegisterOpen(true);
  };

  const handleRegisterClose = () => {
    setRegisterOpen(false);
  };

  const handleLoginOpen = () => {
    setLoginOpen(true);
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(); // Reload to reset the app state
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {localStorage.getItem('token') && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('app_name')}
          </Typography>
          {localStorage.getItem('token') ? (
            <>
              <Button color="inherit" onClick={handleLogout}>
                {t('logout')}
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleLoginOpen}>
                {t('login')}
              </Button>
              <Button color="inherit" onClick={handleRegisterOpen}>
                {t('register')}
              </Button>
            </>
          )}
          <HeaderSettingsMenu />
        </Toolbar>
      </AppBar>
      <Sidebar
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
        setCurrentComponent={setCurrentComponent}
      />
      <RegisterModal open={registerOpen} handleClose={handleRegisterClose} />
      <LoginModal open={loginOpen} handleClose={handleLoginClose} />
    </>
  );
};

export default Header;
