import { Box, Button, Stack, Typography } from '@mui/material';
import { useLayoutEffect } from 'react';
import { Link as RouterLink, useOutletContext } from 'react-router-dom';

export default function NotFoundPage() {
  const { setShell } = useOutletContext() ?? {};

  useLayoutEffect(() => {
    if (!setShell) return undefined;
    setShell({
      title: '404',
      subtitle: 'Page not found',
      actions: null,
      filterBar: null,
    });
    return () => setShell(null);
  }, [setShell]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: { xs: '50vh', md: '55vh' },
        py: 4,
      }}
    >
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center', maxWidth: 420, px: 2 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            color: 'primary.main',
            fontSize: { xs: '3rem', sm: '3.75rem' },
            display: { xs: 'none', md: 'block' },
          }}
        >
          404
        </Typography>
        <Typography variant="h5" component="h1" sx={{ display: { xs: 'none', md: 'block' } }}>
          Page not found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The link may be broken or the page was removed. Use the navigation menu or return home.
        </Typography>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button variant="contained" size="large" component={RouterLink} to="/">
            Go home
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
