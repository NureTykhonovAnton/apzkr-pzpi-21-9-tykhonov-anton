import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useUnit } from '../utils/unitContext';
import { useTranslation } from 'react-i18next';

const UnitSwitcher = () => {
  const {t}=useTranslation()
  const [cookies, setCookie] = useCookies(['unit']);
  const { unit, changeUnit } = useUnit();

  useEffect(() => {
    if (cookies.unit) {
      changeUnit(cookies.unit);
    }
  }, [cookies, changeUnit]);

  const handleChange = (event) => {
    const newUnit = event.target.value;
    changeUnit(newUnit);
    setCookie('unit', newUnit, { path: '/' });
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
