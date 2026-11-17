import { createTheme } from '@mui/material/styles';

export const lightMuiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#64748B',
      light: '#94A3B8',
      dark: '#475569',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B'
    },
    divider: '#E2E8F0'
  },
  typography: {
    fontFamily: '"Rethink Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 10
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.8125rem',
          padding: '6px 14px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
          }
        },
        contained: {
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)'
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.25)'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '0.8125rem',
          fontWeight: 600,
          minHeight: 40
        }
      }
    }
  }
});

export const darkMuiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#38BDF8',
      light: '#7DD3FC',
      dark: '#0284C7',
      contrastText: '#0F172A'
    },
    secondary: {
      main: '#94A3B8',
      light: '#CBD5E1',
      dark: '#64748B',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#0B0F19',
      paper: '#151E32'
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8'
    },
    divider: '#243049'
  },
  typography: {
    fontFamily: '"Rethink Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 10
  }
});
