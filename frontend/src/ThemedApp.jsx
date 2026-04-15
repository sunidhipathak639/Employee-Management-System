import { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import ToastHost from './components/ToastHost.jsx';
import App from './App.jsx';
import { useThemeStore } from './store/themeStore';
import { createAppTheme } from './theme/appTheme';

export default function ThemedApp() {
  const mode = useThemeStore((s) => s.mode);
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <ToastHost />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}
