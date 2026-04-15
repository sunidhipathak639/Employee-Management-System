import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar, { SIDEBAR_WIDTH } from '../components/Sidebar';
import AppHeader from '../components/AppHeader';

export default function MainLayout() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shell, setShellState] = useState({});

  const setShell = useCallback((patch) => {
    if (patch == null) {
      setShellState({});
    } else {
      setShellState(patch);
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: { xs: 'background.paper', md: 'background.default' } }}>
      <Box
        component="nav"
        sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}
      >
        {isMdUp ? (
          <Sidebar />
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
              sx: { width: SIDEBAR_WIDTH, bgcolor: 'background.paper', borderRight: 0 },
            }}
          >
            <Sidebar onRequestClose={() => setMobileOpen(false)} />
          </Drawer>
        )}
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          bgcolor: { xs: 'background.paper', md: 'transparent' },
        }}
      >
        <AppHeader onMenuClick={handleDrawerToggle} shell={shell} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1.25, sm: 2.5, md: 3.5, lg: 4 },
            width: '100%',
            overflowX: 'hidden',
            bgcolor: { xs: 'background.paper', md: 'transparent' },
          }}
        >
          <Box sx={{ maxWidth: '1440px', mx: 'auto' }}>
            <Outlet context={{ setShell }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
