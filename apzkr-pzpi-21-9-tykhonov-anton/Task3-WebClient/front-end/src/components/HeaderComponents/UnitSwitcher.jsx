import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { FormControl, Select, MenuItem } from '@mui/material';
import { useUnit } from '../../contexts/unitContext';
import { useTranslation } from 'react-i18next';

const UnitSwitcher = () => {
  const { t } = useTranslation();
  const [cookies, setCookie] = useCookies(['unitPreference']); // Use 'unitPreference' to match the context
  const { unit, changeUnit } = useUnit();

  // Sync unit state with cookie
  useEffect(() => {
    if (cookies.unitPreference) {
      changeUnit(cookies.unitPreference);
    }
  }, [cookies.unitPreference, changeUnit]);


  const handleChange = (event) => {
    const newUnit = event.target.value;
    changeUnit(newUnit);
  };

  return (
    <FormControl style={{ minWidth: 120 }}>
      <Select
        id="unit-select"
        value={unit}
        onChange={handleChange}
      >
        <MenuItem value="km">{t('km')}</MenuItem>
        <MenuItem value="mi">{t('mi')}</MenuItem>
      </Select>
    </FormControl>
  );
};

export default UnitSwitcher;
