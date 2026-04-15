import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Box,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';

export default function DataTablePagination({
  page,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  total,
  rowsPerPageOptions = [5, 10, 25],
}) {
  const theme = useTheme();
  const from = total === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, total);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 1.25, sm: 2 },
        mt: { xs: 2, sm: 3 },
        pt: { xs: 1.5, sm: 2 },
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
          Rows / page
        </Typography>
        <TextField
          select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          variant="standard"
          autoFocus={false}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: '0.875rem',
              fontWeight: 700,
              bgcolor: (t) => alpha(t.palette.action.active, 0.04),
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              '&:hover': {
                bgcolor: (t) => alpha(t.palette.action.active, 0.08),
              },
            },
          }}
          SelectProps={{
            IconComponent: () => null,
            sx: {
              '& .MuiSelect-select': {
                paddingRight: '0 !important',
              },
            },
          }}
        >
          {rowsPerPageOptions.map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 3 },
          justifyContent: 'flex-end',
          ml: { sm: 'auto' },
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
          {from}–{to} <span style={{ opacity: 0.5, fontWeight: 400 }}>of</span> {total}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            disabled={(page + 1) * rowsPerPage >= total}
            onClick={() => onPageChange(page + 1)}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

