import { Box, CircularProgress, Typography } from '@mui/material';

export default function LoadingState({ label = 'Loading…' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 1.5, sm: 2 },
        minHeight: { xs: 180, sm: 220, md: 300 },
        py: { xs: 4, sm: 5, md: 6 },
        px: 2,
      }}
    >
      <CircularProgress size={36} thickness={4} aria-label={label} />
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, textAlign: 'center' }}>
        {label}
      </Typography>
    </Box>
  );
}
