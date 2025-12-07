import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import App from './App';
import { xiaoGenshin } from './theme/xiaoGenshin';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={xiaoGenshin}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);