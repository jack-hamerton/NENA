import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    primaryHover: string;
    borderColor: string;
    colors: {
      [key: string]: string;
    };
    text: {
      [key: string]: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    primaryHover?: string;
    borderColor?: string;
    colors?: {
      [key: string]: string;
    };
    text?: {
      [key: string]: string;
    };
  }
}

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  primaryHover: '#a4d4f9',
  borderColor: '#333',
  colors: {
    accent: '#f48fb1'
  },
  text: {
    primary: '#fff',
    secondary: '#aaa'
  }
});
