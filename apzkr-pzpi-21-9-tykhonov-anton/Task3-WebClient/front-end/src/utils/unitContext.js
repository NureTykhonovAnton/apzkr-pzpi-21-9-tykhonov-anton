// unitContext.js

import { createContext, useContext, useState, useEffect } from 'react';

const UnitContext = createContext();

export const UnitProvider = ({ children }) => {
    const [unit, setUnit] = useState('km');

    const changeUnit = (newUnit) => {
        setUnit(newUnit);
    };

    const convertDistance = (distance, unit) => {
        // Пример конвертации
        return unit === 'mi' ? distance * 0.621371 : distance;
    };

    return (
        <UnitContext.Provider value={{ unit, setUnit, changeUnit, convertDistance }}>
            {children}
        </UnitContext.Provider>
    );
};

export const useUnit = () => useContext(UnitContext);
