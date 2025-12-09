import { createContext, useContext, useState } from 'react';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    console.log('Logging in with:', email, password);
    // setUser( ... );
  };

  const register = (fullName, email, password) => {
    console.log('Registering with:', fullName, email, password);
    // setUser( ... );
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
