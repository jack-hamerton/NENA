
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import EmailVerificationPage from './pages/EmailVerificationPage.jsx';
import HomePage from './pages/HomePage.jsx';
import Calendar from './pages/Calendar.jsx';
import MainLayout from './layout/MainLayout.jsx';

const useAuth = () => {
  const token = localStorage.getItem('authToken');
  return { isAuthenticated: !!token }; 
};

const PrivateRoute = ({ children }) => {
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
        
        <Route 
          path='/*' 
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path='calendar' element={<Calendar />} />
        </Route>
        
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
}

export default App;
