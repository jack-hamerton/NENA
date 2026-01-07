
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import { theme } from '../theme/theme';
import '../styles/global.css';

const MainLayout = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default MainLayout;
