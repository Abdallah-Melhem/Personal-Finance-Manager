import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Check current user on initial load if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await API.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error('Session expired or invalid token:', error.response?.data?.message || error.message);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await API.post('/auth/register', { name, email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Invalid email or password.';
      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API notification error:', error.message);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
