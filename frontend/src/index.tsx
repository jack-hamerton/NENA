import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from 'styled-components';
import { xiaoGenshin } from './theme/xiaoGenshin';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={xiaoGenshin}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
