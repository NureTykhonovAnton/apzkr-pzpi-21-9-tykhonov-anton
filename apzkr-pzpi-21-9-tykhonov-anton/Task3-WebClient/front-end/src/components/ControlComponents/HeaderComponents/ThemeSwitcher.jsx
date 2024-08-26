import React from 'react';
import { Button } from '@mui/material';
import { useTheme } from '../../../contexts/themeContext';
import { useTranslation } from 'react-i18next';

const ThemeSwitcher = () => {
  const { mode, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const theme_text = (mode === 'light' ? t('dark_theme') : t('light_theme'));
  return (
    <Button onClick={toggleTheme}>
      {theme_text}
    </Button>
  );
};

export default ThemeSwitcher;