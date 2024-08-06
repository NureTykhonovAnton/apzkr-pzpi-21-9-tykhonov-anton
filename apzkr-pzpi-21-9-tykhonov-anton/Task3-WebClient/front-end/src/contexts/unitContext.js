import { createContext, useContext, useState, useEffect } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';

const UnitContext = createContext();

export const UnitProvider = ({ children }) => {
    const [cookies, setCookie] = useCookies(['unitPreference']);
    const [unit, setUnit] = useState(cookies.unitPreference || 'km');

    // Update the cookie when the unit changes
    useEffect(() => {
        setCookie('unitPreference', unit, { path: '/', expires: new Date(new Date().getTime() + 365*24*60*60*1000) });
    }, [unit, setCookie]);

    const changeUnit = (newUnit) => {
        setUnit(newUnit);
    };

    const convertDistance = (distance, unit) => {
        // Example conversion
        return unit === 'mi' ? distance * 0.621371 : distance;
    };

    return (
        <CookiesProvider>
            <UnitContext.Provider value={{ unit, setUnit, changeUnit, convertDistance }}>
                {children}
            </UnitContext.Provider>
        </CookiesProvider>
    );
};

export const useUnit = () => useContext(UnitContext);
