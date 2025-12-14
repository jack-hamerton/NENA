import { createTheme } from '@mui/material/styles';

const genshinTheme = createTheme({
  palette: {
    primary: {
      main: '#564333', // Geo
    },
    secondary: {
      main: '#B28850', // Geo construct
    },
    background: {
      default: '#F5F0E6', // Light stone
      paper: '#FFFFFF',   // White
    },
    text: {
      primary: '#564333', // Dark geo
      secondary: '#A28F79', // Lighter geo
    },
    error: {
      main: '#C73E3A', // Pyro
    },
    warning: {
      main: '#F2C24A', // Electro
    },
    info: {
      main: '#59C5F5', // Hydro
    },
    success: {
      main: '#8BC34A', // Dendro
    },
  },
  typography: {
    fontFamily: '"Genshin Impact", sans-serif',
  },
});

export default genshinTheme;
