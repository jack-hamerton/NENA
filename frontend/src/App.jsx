
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './layout/MainLayout';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route
        path="/*"
        element={user ? <MainLayout /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
