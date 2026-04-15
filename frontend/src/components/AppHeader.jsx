import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Toolbar,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { useLocation, Link as RouterLink, useNavigate } from 'react-router-dom';
import { HEADER_PRIMARY_ACTION_CLASS } from './HeaderContainedAddButton';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export const HEADER_HEIGHT = 72;

const CIRCLE_BTN = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.12 : 0.06),
};

function routeFallbackTitle(pathname) {
  if (!pathname || pathname === '/') return 'Home';
  const parts = pathname.split('/').filter(Boolean);
  const [a, b, c] = parts;
  if (a === 'dashboard') return 'Insights';
  if (a === 'departments' && b === 'new') return 'New department';
  if (a === 'departments' && c === 'edit') return 'Edit department';
  if (a === 'departments') return 'Departments';
  if (a === 'roles' && b === 'new') return 'New role';
  if (a === 'roles' && c === 'edit') return 'Edit role';
  if (a === 'roles') return 'Job roles';
  if (a === 'employees' && b === 'new') return 'New employee';
  if (a === 'employees' && c === 'edit') return 'Edit employee';
  if (a === 'employees' && c === 'roles') return 'Role assignments';
  if (a === 'employees') return 'Employees';
  if (a === 'login') return 'Sign in';
  if (a === 'register') return 'Create account';
  return a.charAt(0).toUpperCase() + a.slice(1).replace(/-/g, ' ');
}

function routeFallbackSubtitle(pathname) {
  if (!pathname || pathname === '/') return 'Operations hub';
  const parts = pathname.split('/').filter(Boolean);
  const [a, b, c] = parts;
  if (a === 'dashboard') return 'Charts & analytics';
  if (a === 'departments' && b === 'new') return 'Add a unit and location';
  if (a === 'departments' && c === 'edit') return 'Update name and location';
  if (a === 'departments') return 'Organizational units';
  if (a === 'roles' && b === 'new') return 'Define title and pay grade';
  if (a === 'roles' && c === 'edit') return 'Update title and pay grade';
  if (a === 'roles') return 'Titles & pay grades';
  if (a === 'employees' && b === 'new') return 'Add a team member';
  if (a === 'employees' && c === 'edit') return 'Update profile';
  if (a === 'employees' && c === 'roles') return 'Manage assignments';
  if (a === 'employees') return 'Directory & roles';
  if (a === 'login') return 'Access your workspace';
  if (a === 'register') return 'Join the workspace';
  return '';
}

/**
 * @param {object} props
 * @param {() => void} props.onMenuClick
 * @param {{ title?: string; subtitle?: string; actions?: import('react').ReactNode; filterBar?: import('react').ReactNode; hideHeaderAvatar?: boolean }} props.shell
 */
export default function AppHeader({ onMenuClick, shell = {} }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const token = useAuthStore((s) => s.token);
  const username = useAuthStore((s) => s.username);

  const pathnames = location.pathname.split('/').filter((x) => x);
  const isAuthRoute = /^\/(login|register)\/?$/.test(location.pathname);

  const displayTitle = shell.title || routeFallbackTitle(location.pathname);
  const displaySubtitle = (() => {
    if (shell.subtitle != null && String(shell.subtitle).trim() !== '') return shell.subtitle;
    if (!shell.title) return routeFallbackSubtitle(location.pathname);
    return '';
  })();
  const filterBar = shell.filterBar || null;
  const hideHeaderAvatar = Boolean(shell.hideHeaderAvatar);

  const desktopBar = (
    <Toolbar
      disableGutters
      sx={{
        height: '100%',
        minHeight: HEADER_HEIGHT,
        px: { sm: 2, md: 4 },
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={onMenuClick}
        sx={{ mr: { sm: 1 }, display: { md: 'none' } }}
        size="small"
      >
        <MenuIcon />
      </IconButton>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: { xs: 'none', sm: 'block' } }}>
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            '& .MuiBreadcrumbs-separator': { mx: 1, fontSize: '0.75rem' },
          }}
        >
          <Link
            component={RouterLink}
            underline="hover"
            color="text.secondary"
            to="/"
            sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: 500 }}
          >
            Home
          </Link>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

            return last ? (
              <Typography
                key={to}
                color="text.primary"
                sx={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'capitalize' }}
              >
                {value.replace(/-/g, ' ')}
              </Typography>
            ) : (
              <Link
                key={to}
                component={RouterLink}
                underline="hover"
                color="text.secondary"
                to={to}
                sx={{ fontSize: '0.875rem', fontWeight: 500, textTransform: 'capitalize' }}
              >
                {value.replace(/-/g, ' ')}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { sm: 1.5 }, flexShrink: 0, ml: 'auto' }}>
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            bgcolor: (t) => (t.palette.mode === 'dark' ? alpha(t.palette.common.white, 0.05) : alpha(t.palette.common.black, 0.03)),
            borderRadius: 1,
            px: 2,
            py: 0.5,
            width: 240,
            border: '1px solid transparent',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: (t) => (t.palette.mode === 'dark' ? alpha(t.palette.common.white, 0.08) : alpha(t.palette.common.black, 0.05)),
            },
            '&:focus-within': {
              bgcolor: 'background.paper',
              borderColor: 'primary.main',
              boxShadow: (t) => `0 0 0 4px ${alpha(t.palette.primary.main, 0.1)}`,
            },
          }}
        >
          <SearchIcon sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Search anything..."
            sx={{ fontSize: '0.875rem', width: '100%' }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Box>

        <IconButton onClick={toggleTheme} color="inherit" size="small" aria-label="Toggle light or dark mode">
          {mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
        </IconButton>
      </Box>
    </Toolbar>
  );

  const mobileUniversal = (
    <Box
      sx={{
        px: 1.5,
        pt: 1,
        pb: 1,
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2.5,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 2px 12px ${alpha('#000', theme.palette.mode === 'dark' ? 0.25 : 0.06)}`,
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 56, sm: 60 },
            py: 1,
            px: 1.25,
            gap: 1,
            bgcolor: 'background.paper',
            justifyContent: 'space-between',
          }}
        >
          {isAuthRoute ? (
            <IconButton
              aria-label="Back to home"
              onClick={() => navigate('/')}
              size="small"
              sx={CIRCLE_BTN}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 16, ml: 0.25 }} />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="Open menu"
              edge="start"
              onClick={onMenuClick}
              size="small"
              sx={{ ...CIRCLE_BTN, display: { md: 'none' } }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}

          <Box sx={{ flex: 1, minWidth: 0, textAlign: 'center', px: 0.5 }}>
            <Typography
              component="div"
              sx={{
                fontWeight: 800,
                fontSize: '1rem',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: 'text.primary',
              }}
              noWrap
            >
              {displayTitle}
            </Typography>
            {displaySubtitle && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 0.25,
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.72rem',
                  lineHeight: 1.3,
                }}
                noWrap
              >
                {displaySubtitle}
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexShrink: 0 }}>
            {token && username && !hideHeaderAvatar && (
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  bgcolor: 'secondary.main',
                  color: 'secondary.contrastText',
                }}
                aria-hidden
              >
                {username.charAt(0).toUpperCase()}
              </Avatar>
            )}
            {shell.actions && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: 160,
                  [`& .MuiButton-root:not(.${HEADER_PRIMARY_ACTION_CLASS})`]: {
                    minWidth: 0,
                    px: 1,
                    py: 0.75,
                    fontSize: '0.7rem',
                    borderRadius: 999,
                  },
                  '& .MuiIconButton-root': { ...CIRCLE_BTN, p: 0 },
                }}
              >
                {shell.actions}
              </Box>
            )}
            {isAuthRoute && (
              <IconButton onClick={toggleTheme} size="small" sx={{ ...CIRCLE_BTN }} aria-label="Toggle theme">
                {mode === 'dark' ? <Brightness7Icon sx={{ fontSize: 18 }} /> : <Brightness4Icon sx={{ fontSize: 18 }} />}
              </IconButton>
            )}
          </Stack>
        </Toolbar>

        {filterBar && (
          <Box
            sx={{
              px: 1.25,
              pb: 1.25,
              pt: 0.5,
              borderTop: `1px solid ${theme.palette.divider}`,
              bgcolor: 'background.paper',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                gap: 1,
                width: '100%',
                minWidth: 0,
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                pb: 0.25,
                alignItems: 'center',
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-thumb': {
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.text.primary, 0.15),
                },
              }}
            >
              {filterBar}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        height: { md: HEADER_HEIGHT },
        bgcolor: 'background.paper',
        color: 'text.primary',
        zIndex: theme.zIndex.appBar,
        backdropFilter: { md: 'none' },
        borderBottom: { md: `1px solid ${theme.palette.divider}` },
      }}
    >
      {isMdUp ? desktopBar : mobileUniversal}
    </AppBar>
  );
}
