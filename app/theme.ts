'use client';
import { createTheme } from '@mui/material/styles';
import typography from '@/app/utils/theme/Typography';

// Extend MUI theme to include DataGrid components
declare module '@mui/material/styles' {
  interface Components {
    MuiDataGrid?: {
      styleOverrides?: any;
    };
  }
}

// Aqua theme colors (from Modernize)
const aquaThemeColors = {
  primary: {
    main: '#0074BA',
    light: '#103247',
    dark: '#006DAF',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#47D7BC',
    light: '#0C4339',
    dark: '#39C7AD',
    contrastText: '#ffffff',
  },
};

// Dark background colors (from Modernize)
const darkBackgroundColors = {
  default: '#171c23',
  dark: '#171c23',
  paper: '#171c23',
};

const darkTextColors = {
  primary: '#EAEFF4',
  secondary: '#7C8FAC',
};

// Base dark theme configuration
const baseDarkTheme = {
  direction: 'ltr' as const,
  palette: {
    mode: 'dark' as const,
  },
  typography: typography,
  shape: {
    borderRadius: 8,
  },
  mixins: {
    toolbar: {
      color: '#EAEFF4',
      '@media (min-width: 1200px)': {
        minHeight: '64px',
      },
      '@media (max-width: 1199px)': {
        minHeight: '64px',
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
};

// Create theme with enhanced styling
const theme = createTheme({
  ...baseDarkTheme,
  palette: {
    ...baseDarkTheme.palette,
    ...aquaThemeColors,
    background: darkBackgroundColors,
    text: darkTextColors,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Removed custom scrollbar styling - now using SimpleBar for better cross-browser support
        html: {
          colorScheme: baseDarkTheme.palette.mode,
        },
        // Modernize scrollbar styling
        ' .simplebar-scrollbar:before': {
          background: '#7C8FAC !important',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: darkBackgroundColors.paper,
          color: darkTextColors.primary,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: darkBackgroundColors.paper,
          width: 280,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: darkBackgroundColors.paper,
          border: '1px solid rgba(124, 143, 172, 0.12)',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25), 0px 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(124, 143, 172, 0.12)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25), 0px 1px 3px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 600,
          textTransform: 'capitalize',
        },
        contained: {
          boxShadow: '0px 4px 12px rgba(93, 135, 255, 0.3)',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(93, 135, 255, 0.4)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: aquaThemeColors.primary.main,
            color: aquaThemeColors.primary.contrastText,
            '&:hover': {
              backgroundColor: aquaThemeColors.primary.dark,
            },
            '& .MuiListItemIcon-root': {
              color: aquaThemeColors.primary.contrastText,
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(124, 143, 172, 0.12)',
          borderRadius: '12px',
          backgroundColor: darkBackgroundColors.paper,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25), 0px 1px 3px rgba(0, 0, 0, 0.12)',
          '& .MuiDataGrid-main': {
            borderRadius: '12px',
          },
        },
        columnHeaders: {
          backgroundColor: 'transparent',
          borderBottom: `1px solid rgba(124, 143, 172, 0.2)`,
          borderRadius: 0,
          '& .MuiDataGrid-columnHeader': {
            padding: '12px 16px',
            '&:focus': {
              outline: 'none',
            },
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
            fontSize: '1.0rem',
            color: darkTextColors.primary,
            fontFamily: typography.fontFamily,
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
        },
        cell: {
          borderBottom: `1px solid rgba(124, 143, 172, 0.1)`,
          padding: '12px 16px',
          color: darkTextColors.primary,
          display: 'flex',
          alignItems: 'center',
          '&:focus': {
            outline: 'none',
          },
        },
        row: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(71, 215, 188, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(71, 215, 188, 0.12)',
            },
          },
          '&:last-child': {
            '& .MuiDataGrid-cell': {
              borderBottom: 'none',
            },
          },
        },
        toolbarContainer: {
          padding: '12px 16px',
          borderBottom: `1px solid rgba(124, 143, 172, 0.1)`,
          backgroundColor: 'transparent',
          '& .MuiButtonBase-root': {
            color: darkTextColors.primary,
          },
        },
        footerContainer: {
          borderTop: `1px solid rgba(124, 143, 172, 0.1)`,
          backgroundColor: 'transparent',
          color: darkTextColors.secondary,
        },
        virtualScroller: {
          // Smooth scrolling
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(124, 143, 172, 0.3)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(124, 143, 172, 0.5)',
            },
          },
        },
      },
    },
  },
});

export default theme;
