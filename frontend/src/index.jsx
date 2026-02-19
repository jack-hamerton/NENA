import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.jsx';
import MainLayout from './layout/MainLayout';

console.log('App starting...');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <MainLayout />
  </AuthProvider>
);

console.log('App rendered');
