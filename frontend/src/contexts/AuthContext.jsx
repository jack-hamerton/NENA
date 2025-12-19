
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    // Mock API call
    if (username === 'user' && password === 'password') {
      setUser({ username });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (username, email, password) => {
    // Mock API call
    if (!username || !email || !password) {
      throw new Error('All fields are required');
    }
    setUser({ username });
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
