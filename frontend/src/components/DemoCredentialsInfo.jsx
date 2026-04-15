import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Box, IconButton, Tooltip, Typography, alpha, useTheme } from '@mui/material';

/**
 * Info icon; hover shows demo sign-in credentials in a pill-style panel.
 * @param {{ sx?: import('@mui/material').SxProps }} [props]
 */
export default function DemoCredentialsInfo({ sx: sxProp } = {}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const lavBorder = isDark ? alpha('#a5b4fc', 0.45) : alpha('#818cf8', 0.38);
  const lavBg = isDark ? alpha('#6366f1', 0.14) : alpha('#eef2ff', 0.95);
  const textMain = isDark ? alpha('#f8fafc', 0.98) : '#0f172a';

  const pill = (
    <Box
      sx={{
        py: 1.15,
        px: 2,
        borderRadius: 999,
        bgcolor: lavBg,
        border: `1px solid ${lavBorder}`,
        textAlign: 'center',
        minWidth: 168,
      }}
    >
      <Typography
        sx={{
          display: 'block',
          fontWeight: 700,
          fontSize: '0.75rem',
          color: textMain,
          lineHeight: 1.2,
          mb: 0.35,
        }}
      >
        Demo
      </Typography>
      <Typography
        sx={{
          display: 'block',
          fontWeight: 800,
          fontSize: '0.875rem',
          color: textMain,
          letterSpacing: 0.02,
          lineHeight: 1.25,
        }}
      >
        admin / password
      </Typography>
    </Box>
  );

  return (
    <Tooltip
      title={pill}
      placement="top"
      arrow={false}
      describeChild
      enterTouchDelay={0}
      leaveTouchDelay={4000}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: 'transparent',
            p: 0,
            m: 0.75,
            boxShadow: 'none',
            maxWidth: 'none',
          },
        },
      }}
    >
      <IconButton
        type="button"
        size="small"
        aria-label="Demo sign-in credentials"
        sx={[
          {
            width: 32,
            height: 32,
            color: 'text.secondary',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: isDark ? alpha(theme.palette.common.white, 0.06) : alpha(theme.palette.common.black, 0.03),
            '&:hover': {
              bgcolor: isDark ? alpha(theme.palette.common.white, 0.1) : alpha(theme.palette.common.black, 0.06),
              color: 'primary.main',
            },
          },
          ...(sxProp ? (Array.isArray(sxProp) ? sxProp : [sxProp]) : []),
        ]}
      >
        <InfoOutlined sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );
}
