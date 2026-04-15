import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { NavLink, matchPath, useLocation, useNavigate } from 'react-router-dom';
import { notifySuccess } from '../notify';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const DRAWER_WIDTH = 288;

function isNavActive(pathname, item) {
  if (item.to === '/employees') {
    return pathname === '/employees' || pathname.startsWith('/employees/');
  }
  return Boolean(matchPath({ path: item.to, end: item.end ?? false }, pathname));
}

function DesktopNavLink({ to, label, end }) {
  return (
    <NavLink to={to} end={end} style={{ textDecoration: 'none', color: 'inherit' }}>
      {({ isActive }) => (
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.75,
            py: 1,
            borderRadius: 1,
            fontWeight: isActive ? 700 : 500,
            fontSize: '0.9375rem',
            bgcolor: isActive ? (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.22 : 0.12) : 'transparent',
            color: isActive ? 'primary.main' : 'text.primary',
            border: '1px solid',
            borderColor: isActive ? 'primary.main' : 'transparent',
            transition: (t) =>
              t.transitions.create(['background-color', 'border-color', 'color'], { duration: t.transitions.duration.short }),
            '&:hover': {
              bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.12 : 0.08),
            },
          }}
        >
          {label}
        </Box>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const username = useAuthStore((s) => s.username);
  const logout = useAuthStore((s) => s.logout);
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggle);

  const navItems = useMemo(() => {
    const base = [{ to: '/', label: 'Home', end: true }];
    if (!token) return base;
    return [
      ...base,
      { to: '/dashboard', label: 'Insights', end: true },
      { to: '/departments', label: 'Departments', end: true },
      { to: '/employees', label: 'Employees', end: false },
      { to: '/roles', label: 'Roles', end: true },
    ];
  }, [token]);

  const handleLogout = () => {
    logout();
    notifySuccess('Signed out.');
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ pt: 2, pb: 2 }} role="presentation">
      <Typography variant="subtitle2" color="text.secondary" sx={{ px: 2.5, mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
        Navigate
      </Typography>
      <List disablePadding>
        {navItems.map((item) => (
          <ListItem key={item.to + String(item.end)} disablePadding sx={{ px: 1 }}>
            <ListItemButton
              component={NavLink}
              to={item.to}
              end={item.end}
              selected={isNavActive(location.pathname, item)}
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      {token && (
        <Typography variant="body2" color="text.secondary" sx={{ px: 2.5 }}>
          Signed in as <strong>{username}</strong>
        </Typography>
      )}
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: (t) => alpha(t.palette.background.paper, t.palette.mode === 'dark' ? 0.92 : 0.88),
        backdropFilter: 'saturate(140%) blur(14px)',
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 'xl',
          width: '100%',
          mx: 'auto',
          px: { xs: 1.5, sm: 2, md: 3 },
          minHeight: { xs: 56, sm: 64 },
          gap: 1,
        }}
      >
        <Box
          component={NavLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit', flexShrink: 0 }}
        >
          <Groups2OutlinedIcon color="primary" sx={{ fontSize: { xs: 28, sm: 32 } }} />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.1 }}>
              EMS
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
              Employee hub
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ display: { xs: 'block', sm: 'none' }, fontWeight: 800 }}>
            EMS
          </Typography>
        </Box>

        {isMdDown ? (
          <>
            <IconButton color="inherit" aria-label="open menu" edge="start" onClick={() => setMobileOpen(true)} sx={{ ml: 0.5 }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexGrow: 1, flexWrap: 'wrap', pl: 1 }}>
            {navItems.map((item) => (
              <DesktopNavLink key={item.to + String(item.end)} to={item.to} label={item.label} end={item.end} />
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            size="medium"
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {token ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', lg: 'block' }, maxWidth: 140 }} noWrap>
                {username}
              </Typography>
              <Button color="inherit" variant="outlined" size="small" onClick={handleLogout} sx={{ borderRadius: 1 }}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={NavLink} to="/login" size="small" sx={{ borderRadius: 1 }}>
                Log in
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={NavLink}
                to="/register"
                size="small"
                sx={{ borderRadius: 1, display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            borderRight: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
