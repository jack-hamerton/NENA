
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { getMe } from '../services/user.service';
import { socket } from '../services/socket';

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
          socket.auth = { userId: response.data.id };
          socket.connect();
        } catch (error) {
          console.error("Failed to fetch user", error);
          // Handle error, e.g., by logging out the user
          logout();
        }
      }
    };
    fetchUser();

    return () => {
      socket.disconnect();
    }
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', response.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    const userResponse = await getMe();
    setUser(userResponse.data);
    socket.auth = { userId: userResponse.data.id };
    socket.connect();
  };

  const register = async (username, password, email) => {
    const response = await api.post('/auth/register', { username, password, email });
    localStorage.setItem('token', response.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    const userResponse = await getMe();
    setUser(userResponse.data);
    socket.auth = { userId: userResponse.data.id };
    socket.connect();
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    socket.disconnect();
  };

  const resetPassword = async (email) => {
    await api.post('/auth/forgot-password', { email });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
