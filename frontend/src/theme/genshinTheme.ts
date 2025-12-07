import { createTheme } from '@mui/material/styles';

// Xiao Genshin Impact Color Palette
const primary = '#4a5969'; // Dark slate gray
const secondary = '#73beb0'; // Medium aquamarine
const accent1 = '#5d838a'; // Cadet blue
const background = '#35424c'; // Dark slate gray (darker)
const accent2 = '#427973'; // Viridian green

export const genshinTheme = createTheme({
  palette: {
    primary: {
      main: primary,
    },
    secondary: {
      main: secondary,
    },
    background: {
      default: background,
      paper: primary,
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
    },
    accent: {
        main: accent1,
        dark: accent2
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 500 },
    h2: { fontSize: '2rem', fontWeight: 500 },
    body1: { fontSize: '1rem' },
  },
  components: {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                textTransform: 'none',
            },
            containedPrimary: {
                backgroundColor: secondary,
                color: background,
                '&:hover': {
                    backgroundColor: accent2,
                }
            }
        }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: primary,
          boxShadow: 'none',
          borderBottom: `1px solid ${accent1}`
        },
      },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                backgroundColor: background,
                borderRight: 'none',
            }
        }
    },
    MuiCard: {
        styleOverrides: {
            root: {
                backgroundColor: primary,
                border: `1px solid ${accent1}`,
                borderRadius: 12,
            }
        }
    }
  },
});
