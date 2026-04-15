import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';

const PRIMARY_CLASS = 'header-primary-action';

/**
 * Page shell primary action: full label from md up; icon-only (+) below md.
 */
export default function HeaderContainedAddButton({ label, startIcon = <AddIcon />, children, sx, ...props }) {
  return (
    <Button
      variant="contained"
      className={PRIMARY_CLASS}
      aria-label={label}
      startIcon={startIcon}
      sx={{
        minWidth: { xs: 40, md: 'auto' },
        px: { xs: 0, md: 2 },
        py: { xs: 1, md: 1 },
        borderRadius: { xs: '50%', md: 1 },
        fontSize: { xs: '0.875rem', md: '0.875rem' },
        '& .MuiButton-startIcon': {
          mr: { xs: 0, md: 1 },
          ml: { xs: 0, md: '-4px' },
        },
        ...sx,
      }}
      {...props}
    >
      <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
        {children}
      </Box>
    </Button>
  );
}

export { PRIMARY_CLASS as HEADER_PRIMARY_ACTION_CLASS };
