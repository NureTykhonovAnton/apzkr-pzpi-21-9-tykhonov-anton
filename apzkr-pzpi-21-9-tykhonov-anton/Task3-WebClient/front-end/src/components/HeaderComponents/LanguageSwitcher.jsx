import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, Select, MenuItem } from '@mui/material';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (event) => {
    const lng = event.target.value;
    setLanguage(lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    
    // Cleanup on unmount
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  return (
    <FormControl style={{ minWidth: 60 }} sx={{ p: -2 }}>
      <Select
        id="language-select"
        value={language}
        onChange={changeLanguage}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="ua">Українська</MenuItem>
        <MenuItem value="he_IL">עִברִית</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
