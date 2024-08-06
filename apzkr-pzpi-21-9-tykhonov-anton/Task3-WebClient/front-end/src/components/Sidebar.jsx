import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from '../contexts/authContext';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ drawerOpen, toggleDrawer, setCurrentComponent }) => {
  const { t } = useTranslation();
  const { role } = useAuth();

  const handleItemClick = (component) => {
    console.log(component)
    setCurrentComponent(component);
    toggleDrawer(false)();
  };

  return (
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <List mx={{ p: 2 }}>
            {role?.name.toLowerCase() === 'user' && (
              <>
                <ListItem button onClick={() => handleItemClick('map')} >
                  <ListItemText primary={t('map')} />
                </ListItem>
                <ListItem button onClick={() => handleItemClick('emergency_management')}>
                  <ListItemText primary={t('history')} />
                </ListItem>
                <ListItem button onClick={() => handleItemClick('transport')}>
                  <ListItemText primary={t('transport')} />
                </ListItem>
              </>
            )}
            {role?.name.toLowerCase() === 'admin' && (
              <ListItem button onClick={() => handleItemClick('user')}>
                <ListItemText primary={t('user')} />
              </ListItem>
            )}
          </List>
        </Drawer>
  );
};

export default Sidebar;
