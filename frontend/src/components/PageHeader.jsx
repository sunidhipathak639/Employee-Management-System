import { Box, Stack, Typography } from '@mui/material';
import { useLayoutEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

/**
 * Desktop: large title + description + actions.
 * Mobile (&lt; md): registers the universal header via outlet `setShell` (title, subtitle, actions, optional filterBar, hideHeaderAvatar).
 */
export default function PageHeader({ title, description, actions, filterBar, hideHeaderAvatar = false }) {
  const ctx = useOutletContext();
  const setShell = ctx?.setShell;

  useLayoutEffect(() => {
    if (!setShell) return undefined;
    setShell({
      title,
      subtitle: description || '',
      actions: actions ?? null,
      filterBar: filterBar ?? null,
      hideHeaderAvatar: Boolean(hideHeaderAvatar),
    });
    return () => {
      setShell(null);
    };
  }, [setShell, title, description, actions, filterBar, hideHeaderAvatar]);

  return (
    <Box sx={{ display: { xs: 'none', md: 'block' }, mb: { md: 5 } }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ width: '100%' }}
      >
        <Box sx={{ minWidth: 0, flexGrow: 1, flexShrink: 1 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.03em',
              mb: description ? 1 : 0,
              fontSize: { md: '2.25rem' },
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                fontWeight: 500,
                lineHeight: 1.55,
                fontSize: '0.9375rem',
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
        {actions && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexShrink: 0,
            }}
          >
            {actions}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
