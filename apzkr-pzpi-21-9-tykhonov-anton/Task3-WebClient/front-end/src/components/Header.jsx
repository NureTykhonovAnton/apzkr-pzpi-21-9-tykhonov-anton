import React, { useState, createTheme, ThemePro } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, CircularProgress,} from '@mui/material';
import RegisterModal from './RegisterModalComponent';
import LoginModal from './LoginModalComponent';
import { useAuth } from '../utils/authContext';
import LanguageSwitcher from './LanguageSwitcherComponent';
import { useTranslation } from 'react-i18next';
import UnitSwitcher from './UnitSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
  const { t } = useTranslation();
  const { role, loading } = useAuth();
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

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

  if (loading) {
    return <CircularProgress />;
  }
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
          {localStorage.getItem('token') ? (
            <>
              {role?.name === 'admin' && <Button color="inherit" component={Link} to="/admin-page">Admin Page</Button>}
              {role?.name === 'user' && <Button color="inherit" component={Link} to="/user-page">User Page</Button>}
              <Button color="inherit" onClick={handleLogout}>{t('logout')}</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleLoginOpen}>{t('login')}</Button>
              <Button color="inherit" onClick={handleRegisterOpen}>{t('register')}</Button>
            </>
          )}
            <LanguageSwitcher />
            <UnitSwitcher />
            <ThemeSwitcher/>
        </Toolbar>
      </AppBar>
      <RegisterModal open={registerOpen} handleClose={handleRegisterClose} />
      <LoginModal open={loginOpen} handleClose={handleLoginClose} />
    </>
  );
};

export default Header;
