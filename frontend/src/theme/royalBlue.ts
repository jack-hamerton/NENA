import { createTheme } from '@mui/material/styles';

export const royalBlue = createTheme({
  palette: {
    primary: {
      main: '#4a5969',
    },
    secondary: {
      main: '#73beb0',
    },
    background: {
      default: '#35424c',
      paper: '#427973',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Inter, sans-serif',
      fontWeight: 700,
    },
    body1: {
      fontFamily: 'Inter, sans-serif',
    },
    button: {
      fontFamily: 'Inter, sans-serif',
    },
  },
});
