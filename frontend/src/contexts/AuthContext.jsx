
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import { getMe } from '../services/user.service';
import { socket } from '../services/socket';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await getMe();
        setUser(response.data);
        // Ensure socket auth is set before connecting
        if (!socket.auth || socket.auth.userId !== response.data.id) {
          socket.auth = { userId: response.data.id };
          socket.connect();
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const onConnect = () => {
      console.log('Socket connected, fetching user...');
      fetchUser().finally(() => setLoading(false));
    };

    const onDisconnect = () => {
      console.log('Socket disconnected.');
      setUser(null);
    };

    // Initial check
    fetchUser();

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [fetchUser]);

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', response.data.access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    await fetchUser(); // fetchUser will connect the socket
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('token', response.data.access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    await fetchUser(); // fetchUser will connect the socket
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
    <AuthContext.Provider value={{ user, setUser, login, logout, register, resetPassword, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
