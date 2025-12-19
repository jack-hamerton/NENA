
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Podcasts from './pages/Podcasts';
import Discover from './pages/Discover';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route
        path="/"
        element={user ? <HomePage /> : <Navigate to="/login" />}
      />
      <Route
        path="/podcasts"
        element={user ? <Podcasts /> : <Navigate to="/login" />}
      />
      <Route
        path="/discover"
        element={user ? <Discover /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
