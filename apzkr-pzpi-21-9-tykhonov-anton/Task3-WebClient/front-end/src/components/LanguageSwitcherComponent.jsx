import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';




const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = React.useState(i18n.language);

  


  const changeLanguage = (event) => {
    const lng = event.target.value;
    setLanguage(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <FormControl  style={{ minWidth: 60 }} sx={{p:-2}}>
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
