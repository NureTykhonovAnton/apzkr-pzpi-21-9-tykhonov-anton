import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Collapse, IconButton, ListItemSecondaryAction } from '@mui/material';
import { useAuth } from '../../contexts/authContext';
import { useTranslation } from 'react-i18next';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const Sidebar = ({ drawerOpen, toggleDrawer, setCurrentComponent }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [openZoneSubMenu, setOpenZoneSubMenu] = useState({});

  const handleItemClick = (component) => {
    console.log(component);
    setCurrentComponent(component);
    toggleDrawer(false)();
  };

  const handleMenuHeaderClick = (menu) => {
    setOpenZoneSubMenu((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleSubMenuItemClick = (component) => {
    setCurrentComponent(component);
    toggleDrawer(false)();
  };

  return (
    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
      <List sx={{ padding: 2 }}>
        {user && user.role && user.role.toLowerCase() === 'user' && (
          <>
            <ListItem button onClick={() => handleItemClick('profile')}>
              <ListItemText primary={t('profile')} />
            </ListItem>
            <ListItem button onClick={() => handleItemClick('map')}>
              <ListItemText primary={t('map')} />
            </ListItem>
          </>
        )}
        {user && user.role && user.role.toLowerCase() === 'admin' && (
          <>
            <ListItem button onClick={() => handleItemClick('profile')}>
              <ListItemText primary={t('profile')}
               />
            </ListItem>
            <ListItem button onClick={() => handleItemClick('map')}>
              <ListItemText primary={t('map')} />
            </ListItem>
            <ListItem button onClick={() => handleItemClick('users')}>
              <ListItemText primary={t('users')} />
            </ListItem>
            <ListItem button onClick={() => handleMenuHeaderClick('evacuationsMenu')}>
              <ListItemText primary={t('zones')} onClick={() => handleItemClick('zones')} />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={(e) => {
                  e.stopPropagation();
                  handleMenuHeaderClick('evacuationsMenu');
                }}>
                  {openZoneSubMenu['evacuationsMenu'] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={openZoneSubMenu['evacuationsMenu']} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleSubMenuItemClick('evacuations')}>
                  <ListItemText primary={t('evacuations')} />
                </ListItem>
                <ListItem button sx={{ pl: 4 }} onClick={() => handleSubMenuItemClick('emergency-types')}>
                  <ListItemText primary={t('emergency-types')} />
                </ListItem>
              </List>
            </Collapse>
            <ListItem button onClick={() => handleItemClick('centers')}>
              <ListItemText primary={t('centers')} />
            </ListItem>
            <ListItem button onClick={() => handleItemClick('iot')}>
              <ListItemText primary={t('iot')} />
            </ListItem>
            <ListItem button onClick={() => handleItemClick('logViewer')}>
              <ListItemText primary={t('logViewer')} />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;
