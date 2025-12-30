
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { getMe } from '../services/user.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await getMe();
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user", error);
          // Handle error, e.g., by logging out the user
          logout();
        }
      }
    };
    fetchUser();
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', response.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    const userResponse = await getMe();
    setUser(userResponse.data);
  };

  const register = async (username, password, email) => {
    const response = await api.post('/auth/register', { username, password, email });
    localStorage.setItem('token', response.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    const userResponse = await getMe();
    setUser(userResponse.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
