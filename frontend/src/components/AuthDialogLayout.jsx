import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, IconButton, Typography, alpha, useTheme } from '@mui/material';
import DemoCredentialsInfo from './DemoCredentialsInfo';
import { useThemeStore } from '../store/themeStore';

/** Sky accent for optional use outside this layout. */
export const AUTH_SKY_MAIN = '#0ea5e9';
export const AUTH_SKY_HOVER = '#0284c7';

/** Auth card max width in px (login + register). */
export const AUTH_MODAL_WIDTH_PX = 370;

/** Same min-height for login + register so both modals match. */
export const AUTH_MODAL_MIN_HEIGHT_PX = 428;

/**
 * Full-viewport gradient + centered auth card (fixed width + min-height for parity).
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {(reason?: string) => void} props.onRequestClose
 * @param {boolean} [props.showDemoCredentials] When true, show demo-credentials info icon (login only).
 * @param {React.ReactNode} props.children
 */
export default function AuthDialogLayout({
  title,
  subtitle,
  onRequestClose,
  showDemoCredentials = false,
  children,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const mode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggle);

  const titleClearance = showDemoCredentials ? { xs: 14, sm: 15 } : { xs: 10, sm: 11 };

  const pageBg = isDark
    ? `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 50%),
       radial-gradient(at 100% 100%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%),
       #0f172a`
    : `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 55%),
       radial-gradient(at 100% 100%, ${alpha('#0ea5e9', 0.08)} 0%, transparent 50%),
       linear-gradient(180deg, #f1f5f9 0%, #e8eef7 100%)`;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1.5, sm: 2 },
        background: pageBg,
        '@supports (min-height: 100dvh)': {
          minHeight: '100dvh',
        },
      }}
    >
      <Dialog
        open
        maxWidth={false}
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            onRequestClose(reason);
          }
        }}
        disableRestoreFocus
        slotProps={{
          backdrop: {
            sx: {
              bgcolor: isDark ? alpha('#020617', 0.55) : alpha('#64748b', 0.22),
            },
          },
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            boxSizing: 'border-box',
            /* Avoid Dialog `fullWidth` — it stretches paper on large screens past this cap. */
            width: `min(${AUTH_MODAL_WIDTH_PX}px, calc(100vw - 32px))`,
            maxWidth: `${AUTH_MODAL_WIDTH_PX}px`,
            minHeight: AUTH_MODAL_MIN_HEIGHT_PX,
            borderRadius: 3,
            bgcolor: isDark ? alpha(theme.palette.background.paper, 0.98) : '#ffffff',
            border: `1px solid ${isDark ? alpha('#fff', 0.08) : alpha(theme.palette.divider, 0.9)}`,
            boxShadow: isDark
              ? `0 24px 48px ${alpha('#000', 0.45)}`
              : `0 12px 40px ${alpha('#0f172a', 0.08)}, 0 4px 12px ${alpha('#0f172a', 0.04)}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        sx={{ zIndex: (t) => t.zIndex.modal }}
        aria-labelledby="auth-dialog-title"
      >
        <Box
          sx={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            px: { xs: 2.5, sm: 3 },
            pt: { xs: 2.75, sm: 3 },
            pb: { xs: 2.5, sm: 3 },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
            }}
          >
            <IconButton
              aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={() => toggleTheme()}
              size="small"
              sx={{
                width: 32,
                height: 32,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: isDark ? alpha(theme.palette.common.white, 0.06) : alpha(theme.palette.common.black, 0.03),
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: isDark ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.06),
                },
              }}
            >
              {mode === 'dark' ? <Brightness7Icon sx={{ fontSize: 16 }} /> : <Brightness4Icon sx={{ fontSize: 16 }} />}
            </IconButton>
            {showDemoCredentials ? <DemoCredentialsInfo /> : null}
            <IconButton
              aria-label="Close"
              onClick={() => onRequestClose('closeButton')}
              size="small"
              sx={{
                width: 32,
                height: 32,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: isDark ? alpha(theme.palette.common.white, 0.06) : alpha(theme.palette.common.black, 0.03),
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: isDark ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.06),
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Typography
            id="auth-dialog-title"
            component="h1"
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              fontSize: '1.125rem',
              color: isDark ? theme.palette.text.primary : '#0f172a',
              mb: subtitle ? 0.5 : 1.25,
              /* Reserve space for the top-right icon cluster only on the heading (not the form). */
              pr: titleClearance,
            }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                lineHeight: 1.5,
                fontSize: '0.8125rem',
                pr: titleClearance,
              }}
            >
              {subtitle}
            </Typography>
          ) : (
            <Box sx={{ mb: 1.75 }} />
          )}

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, width: '100%' }}>{children}</Box>
        </Box>
      </Dialog>
    </Box>
  );
}
