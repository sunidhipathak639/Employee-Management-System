import { Box, Button, Container, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function AppFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: { xs: 2, sm: 2.5 },
        px: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="caption" color="text.secondary" textAlign={{ xs: 'center', sm: 'left' }}>
            © {new Date().getFullYear()} Employee Management System
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            <Link component={RouterLink} to="/" underline="hover" color="text.secondary" variant="caption">
              Home
            </Link>
            <Button
              type="button"
              size="small"
              color="inherit"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              sx={{ textTransform: 'none', minWidth: 0, fontSize: '0.75rem', color: 'text.secondary' }}
            >
              Back to top
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
