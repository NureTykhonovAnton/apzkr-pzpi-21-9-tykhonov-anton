// src/components/SettingsMenu.js
import React, { useState } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LanguageSwitcher from './LanguageSwitcher';
import UnitSwitcher from './UnitSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

const HeaderSettingsMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        edge="end"
        color="inherit"
        aria-label="settings"
        onClick={handleClick}
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem>
          <LanguageSwitcher />
        </MenuItem>
        <MenuItem>
          <UnitSwitcher />
        </MenuItem>
        <MenuItem>
          <ThemeSwitcher />
        </MenuItem>
      </Menu>
    </>
  );
};

export default HeaderSettingsMenu;
