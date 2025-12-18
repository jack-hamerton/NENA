
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { useAuth } from './contexts/AuthContext';
import CreatePodcast from './components/podcast/CreatePodcast'; // Import CreatePodcast

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={user ? <HomePage /> : <Navigate to="/login" />}
      />
      <Route
        path="/create-podcast"
        element={user ? <CreatePodcast /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
