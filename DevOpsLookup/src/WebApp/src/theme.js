import { createTheme } from '@mui/material/styles';

// Azure-väripaletti
const theme = createTheme({
  palette: {
    primary: {
      main: '#0078d4', // Azure sininen
      light: '#50a0e9',
      dark: '#004578',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2b88d8', // Vaaleampi sininen
      light: '#6ab7ff',
      dark: '#0062a3',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d13438', // Punainen
    },
    warning: {
      main: '#ffaa44', // Oranssi
    },
    info: {
      main: '#00b7c3', // Turkoosi
    },
    success: {
      main: '#107c10', // Vihreä
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      'Segoe UI',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#106ebe',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme; 