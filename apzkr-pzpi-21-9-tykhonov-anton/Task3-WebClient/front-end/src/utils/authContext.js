import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../api/userRequests';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState({ name: '' });
  const navigate = useNavigate();
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await fetchUserData(token);
          setRole(userData.role);
          if (userData.role && userData.role.name) {
            const name = userData.role.name;
            if (name.toLowerCase() === 'admin') {
              navigate('/admin-page');
            } else if (name.toLowerCase() === 'user') {
              navigate('/user-page');
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking token:', error);
          navigate('/');
        }
      } else {
        navigate('/');
      }
      setLoading(false);
    };

    checkToken();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ role, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
