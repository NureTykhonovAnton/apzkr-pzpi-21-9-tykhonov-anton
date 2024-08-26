import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser, fetchUserData } from '../api/userRequests';

// Create a Context for authentication
const AuthContext = createContext();

/**
 * Provides authentication state and actions to child components.
 * 
 * This component checks for an existing token on mount, retrieves user data
 * if the token is valid, and handles navigation based on the user's role.
 * It also provides a function to delete the user's account.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components to be rendered.
 * 
 * @returns {React.ReactElement} - The provider component with authentication state.
 */
export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Checks for a valid authentication token and fetches user data.
     * Redirects to the home page if no token is found or if there is an error
     * fetching user data.
     */
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await fetchUserData(token);
          setUser(userData);
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

  useEffect(() => {
    /**
     * Navigates to a specific page based on the user's role once loading is complete.
     * Redirects to the home page if the user's role is unrecognized.
     */
    if (!loading && user) {
      if (user.role.toLowerCase() === 'admin') {
        navigate('/admin-page');
      } else if (user.role.toLowerCase() === 'user') {
        navigate('/user-page');
      } else {
        navigate('/');
      }
    }
  }, [loading, user, navigate]);

  /**
   * Deletes the user's account and clears user data from the state.
   * 
   * @async
   * @returns {Promise<void>} - A promise that resolves when the account is deleted.
   */
  const deleteAccount = async () => {
    try {
      await deleteUser(user.id);
      setUser(null); // Clear user data from state
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, deleteAccount }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context values.
 * 
 * @returns {Object} - The authentication context values including user data, 
 *                      loading state, and account management functions.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
