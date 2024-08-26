import { createContext, useContext, useState, useEffect } from 'react';
import { CookiesProvider, useCookies } from 'react-cookie';

// Create a Context for managing the unit of measurement
const UnitContext = createContext();

export const UnitProvider = ({ children }) => {
  // Use react-cookie to manage the unit preference in cookies
  const [cookies, setCookie] = useCookies(['unitPreference']);
  
  // State to manage the current unit of measurement, defaulting to 'km'
  const [unit, setUnit] = useState(cookies.unitPreference || 'km');

  // Update the cookie whenever the unit changes
  useEffect(() => {
    setCookie('unitPreference', unit, {
      path: '/',
      expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000) // Cookie expires in 1 year
    });
  }, [unit, setCookie]);

  // Function to change the unit of measurement
  const changeUnit = (newUnit) => {
    setUnit(newUnit);
  };

  // Function to convert distance between kilometers and miles
  const convertDistance = (distance, unit) => {
    // Example conversion factor: 1 kilometer = 0.621371 miles
    return unit === 'mi' ? distance * 0.621371 : distance;
  };

  // Provide the current unit, changeUnit function, and convertDistance function to the context
  return (
    <CookiesProvider>
      <UnitContext.Provider value={{ unit, setUnit, changeUnit, convertDistance }}>
        {children}
      </UnitContext.Provider>
    </CookiesProvider>
  );
};

// Custom hook to use the UnitContext
export const useUnit = () => useContext(UnitContext);
