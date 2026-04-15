import { alpha, createTheme } from '@mui/material/styles';

/**
 * Application theme — typography, color system, shape, and component defaults.
 * See docs/FRONTEND_UI_UX.md for responsive and accessibility notes.
 */
export function createAppTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#818cf8' : '#6366f1', // Indigo 400ish for dark, 500 for light
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#f472b6' : '#ec4899', // Pink 400/500
      },
      success: { main: isDark ? '#34d399' : '#10b981' },
      warning: { main: isDark ? '#fbbf24' : '#f59e0b' },
      error: { main: isDark ? '#f87171' : '#ef4444' },
      background: {
        default: isDark ? '#0f172a' : '#f8fafc', // Slate 900 / 50
        paper: isDark ? '#1e293b' : '#ffffff',   // Slate 800 / White
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
      divider: isDark ? alpha('#e2e8f0', 0.06) : alpha('#0f172a', 0.06),
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, -apple-system, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.03em' },
      h2: { fontWeight: 800, letterSpacing: '-0.02em' },
      h3: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 },
      h4: { fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 600, fontSize: '1rem' },
      subtitle2: { fontWeight: 600, fontSize: '0.875rem' },
      body1: { fontSize: '0.9375rem', lineHeight: 1.5 },
      body2: { fontSize: '0.875rem', lineHeight: 1.57 },
      button: { fontWeight: 700, textTransform: 'none', letterSpacing: '0.01em' },
    },
    shadows: [
      'none',
      `0 1px 2px ${alpha('#000', 0.05)}`,
      `0 4px 6px -1px ${alpha('#000', 0.1)}, 0 2px 4px -1px ${alpha('#000', 0.06)}`,
      `0 10px 15px -3px ${alpha('#000', 0.1)}, 0 4px 6px -2px ${alpha('#000', 0.05)}`,
      `0 20px 25px -5px ${alpha('#000', 0.1)}, 0 10px 10px -5px ${alpha('#000', 0.04)}`,
      ...Array(20).fill('none'), // Fill the rest to avoid errors
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollBehavior: 'smooth',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            paddingInline: 20,
            transition: 'all 0.2s ease-in-out',
            [theme.breakpoints.down('sm')]: {
              paddingInline: 14,
              paddingBlock: 6,
              fontSize: '0.8125rem',
            },
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }),
          sizeLarge: {
            paddingBlock: 12,
            fontSize: '1rem',
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.palette.mode === 'dark' 
              ? `0 4px 20px ${alpha('#000', 0.4)}` 
              : `0 4px 20px ${alpha('#64748b', 0.08)}`,
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            transition: 'border-color 0.2s, box-shadow 0.2s',
            '&:hover': {
              borderColor: alpha(theme.palette.primary.main, 0.2),
              boxShadow: theme.palette.mode === 'dark'
                ? `0 12px 30px ${alpha('#000', 0.5)}`
                : `0 12px 30px ${alpha('#64748b', 0.12)}`,
            },
          }),
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: '12px 16px',
            borderBottom: `1px solid var(--mui-palette-divider)`,
            [theme.breakpoints.down('sm')]: {
              padding: '8px 10px',
              fontSize: '0.8125rem',
            },
          }),
          head: ({ theme }) => ({
            fontWeight: 700,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.mode === 'dark' 
              ? alpha(theme.palette.common.white, 0.02) 
              : alpha(theme.palette.primary.main, 0.02),
            [theme.breakpoints.down('sm')]: {
              fontSize: '0.6875rem',
              padding: '8px 10px',
            },
          }),
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: ({ theme }) => ({
            [theme.breakpoints.down('sm')]: {
              paddingTop: theme.spacing(1.5),
              paddingBottom: theme.spacing(2),
            },
          }),
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.03) : alpha(theme.palette.common.black, 0.01),
              transition: theme.transitions.create(['border-color', 'box-shadow']),
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.02),
              },
              '&.Mui-focused': {
                backgroundColor: 'transparent',
                boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
              },
            },
          }),
        },
      },
    },
  });
}

