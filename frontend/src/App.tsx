
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import HomePage from './pages/HomePage'; // Assuming you have a home page

// A simple mock for auth status. In a real app, you'd use a context or state management.
const useAuth = () => {
  // For demonstration, we'll just check for a token in localStorage.
  const token = localStorage.getItem('authToken');
  return { isAuthenticated: !!token }; 
};

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to='/login' />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/verify-email' element={<EmailVerificationPage />} />
        
        {/* Protected Route */}
        <Route 
          path='/' 
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        
        {/* Redirect any other path to the home page or login */}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
}

export default App;
