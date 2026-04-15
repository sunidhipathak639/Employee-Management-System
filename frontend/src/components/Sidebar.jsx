import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { notifySuccess } from '../notify';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export const SIDEBAR_WIDTH = 280;

/**
 * @param {object} [props]
 * @param {() => void} [props.onRequestClose] When set (e.g. mobile drawer), called after a navigation choice so the drawer can close.
 */
export default function Sidebar({ onRequestClose }) {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const username = useAuthStore((s) => s.username);
  const logout = useAuthStore((s) => s.logout);
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggle);

  const navItems = [
    { to: '/', label: 'Home', icon: <HomeOutlinedIcon />, end: true },
    ...(token
      ? [
          { to: '/dashboard', label: 'Insights', icon: <AnalyticsOutlinedIcon />, end: true },
          { to: '/departments', label: 'Departments', icon: <BusinessOutlinedIcon />, end: true },
          { to: '/employees', label: 'Employees', icon: <GroupsOutlinedIcon />, end: false },
          { to: '/roles', label: 'Roles', icon: <SecurityOutlinedIcon />, end: true },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout();
    notifySuccess('Signed out.');
    navigate('/login');
    onRequestClose?.();
  };

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bgcolor: 'background.paper',
        borderRight: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: theme.zIndex.drawer,
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
        }}
        onClick={() => {
          navigate('/');
          onRequestClose?.();
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.contrastText',
            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
          }}
        >
          <Groups2OutlinedIcon />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: -0.5 }}>
            EMS
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Workspace
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, px: { xs: 1.5, sm: 2 }, py: { xs: 2, sm: 2.5, md: 3 }, overflowY: 'auto' }}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            mb: 2,
            display: 'block',
            textTransform: 'uppercase',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'text.secondary',
            opacity: 0.8,
          }}
        >
          Main Menu
        </Typography>
        <List disablePadding>
          {navItems.map((item) => (
            <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.to}
                end={item.end}
                onClick={() => onRequestClose?.()}
                sx={{
                  borderRadius: 1,
                  py: 1,
                  px: 2,
                  transition: 'all 0.2s',
                  '&.active': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      right: 8,
                      width: 4,
                      height: 16,
                      borderRadius: '2px',
                      bgcolor: 'primary.main',
                    },
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary', transition: 'color 0.2s' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {isMdDown && (
        <>
          <Divider sx={{ mx: 2, opacity: 0.5 }} />
          <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 1.5 }}>
            <ListItem disablePadding sx={{ mb: 0 }}>
              <ListItemButton
                onClick={toggleTheme}
                sx={{
                  borderRadius: 1,
                  py: 1,
                  px: 2,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
                aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                  {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </ListItemIcon>
                <ListItemText
                  primary={mode === 'dark' ? 'Light mode' : 'Dark mode'}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }}
                />
              </ListItemButton>
            </ListItem>
          </Box>
        </>
      )}

      {/* Footer / User Profile */}
      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        {token ? (
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: (t) => (t.palette.mode === 'dark' ? alpha(t.palette.common.white, 0.03) : alpha(t.palette.common.black, 0.02)),
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'secondary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                }}
              >
                {username?.charAt(0).toUpperCase()}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                  {username}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                  Administrator
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="text"
              size="small"
              startIcon={<LogoutIcon fontSize="small" />}
              onClick={handleLogout}
              sx={{
                justifyContent: 'flex-end',
                borderRadius: 1,
                color: 'text.secondary',
                '&:hover': { color: 'error.main', bgcolor: (t) => alpha(t.palette.error.main, 0.08) },
              }}
            >
              Sign Out
            </Button>
          </Box>
        ) : (
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              navigate('/login');
              onRequestClose?.();
            }}
            sx={{ borderRadius: 1, py: 1.25, justifyContent: 'flex-end' }}
          >
            Sign In
          </Button>
        )}
      </Box>
    </Box>
  );
}
