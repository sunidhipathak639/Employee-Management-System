import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import api, { unwrap } from '../api';
import { notifyError, notifyFieldErrors, notifyFirstFormValidationError, notifySuccess } from '../notify';
import ConfirmDialog from '../components/ConfirmDialog';
import DataTablePagination from '../components/DataTablePagination';
import LoadingState from '../components/LoadingState';
import HeaderContainedAddButton from '../components/HeaderContainedAddButton';
import PageHeader from '../components/PageHeader';

export default function DepartmentsPage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const dialogActive = dialogOpen && isMdUp;
  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (row) => {
    setEditing(row);
    setDialogOpen(true);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/departments');
      setRows(unwrap(res));
    } catch (e) {
      notifyError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!isMdUp) setDialogOpen(false);
  }, [isMdUp]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) => r.name.toLowerCase().includes(s) || (r.location && r.location.toLowerCase().includes(s))
    );
  }, [rows, q]);

  const pageRows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const mobileFilterBar = useMemo(
    () => (
      <TextField
        fullWidth
        size="small"
        placeholder="Search departments…"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setPage(0);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            </InputAdornment>
          ),
          sx: { borderRadius: 999, bgcolor: (t) => alpha(t.palette.action.hover, 0.06), fontSize: '0.8125rem' },
        }}
        sx={{ flex: '1 1 auto', minWidth: 0, width: '100%' }}
      />
    ),
    [q]
  );

  if (loading) {
    return <LoadingState label="Loading departments…" />;
  }

  return (
    <Box>
      <PageHeader
        title={dialogActive ? (editing ? 'Edit Department' : 'New Department') : 'Departments'}
        description={
          dialogActive
            ? editing
              ? 'Update name and location for this unit.'
              : 'Add an organizational unit and office location.'
            : 'Global organizational units and office locations.'
        }
        hideHeaderAvatar
        filterBar={dialogActive ? null : mobileFilterBar}
        actions={
          dialogActive ? (
            <IconButton aria-label="Close" onClick={() => setDialogOpen(false)} size="small" color="inherit">
              <CloseIcon />
            </IconButton>
          ) : isMdUp ? (
            <HeaderContainedAddButton label="Add department" onClick={openCreate}>
              Add Department
            </HeaderContainedAddButton>
          ) : (
            <HeaderContainedAddButton label="Add department" component={RouterLink} to="/departments/new">
              Add Department
            </HeaderContainedAddButton>
          )
        }
      />

      <Paper
        sx={{
          borderRadius: 1,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            p: { xs: 1.25, sm: 2 },
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: (t) => alpha(t.palette.background.default, 0.4),
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'flex-end',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search departments..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', ml: 1 }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 1, bgcolor: 'background.paper' },
            }}
            sx={{ maxWidth: 500, width: { xs: '100%', sm: 'min(100%, 500px)' } }}
          />
        </Box>

        <Stack spacing={1.5} sx={{ display: { xs: 'flex', md: 'none' }, p: { xs: 1.25, sm: 1.5 } }}>
          {pageRows.map((r) => (
            <Card
              key={r.id}
              variant="outlined"
              elevation={0}
              sx={{
                borderRadius: 2,
                borderColor: 'divider',
                bgcolor: (t) => alpha(t.palette.background.default, t.palette.mode === 'dark' ? 0.2 : 0.5),
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack spacing={1.25}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.06 }}>
                        Department
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mt: 0.25 }}>
                        {r.name}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0, mt: -0.25 }}>
                      {isMdUp ? (
                        <IconButton
                          onClick={() => openEdit(r)}
                          aria-label="Edit department"
                          size="small"
                          sx={{ color: 'text.secondary', '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.05) } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton
                          component={RouterLink}
                          to={`/departments/${r.id}/edit`}
                          aria-label="Edit department"
                          size="small"
                          sx={{ color: 'text.secondary', '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.05) } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="Delete department"
                        size="small"
                        onClick={() => setDepartmentToDelete({ id: r.id, name: r.name })}
                        sx={{ color: 'error.main', '&:hover': { bgcolor: (t) => alpha(t.palette.error.main, 0.08) } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 0.06 }}>
                      Location
                    </Typography>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        mt: 0.5,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: (t) => alpha(t.palette.secondary.main, 0.08),
                        color: 'secondary.main',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        maxWidth: '100%',
                      }}
                    >
                      {r.location}
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
          {pageRows.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="text.secondary" variant="body2">
                No departments found.
              </Typography>
            </Box>
          )}
        </Stack>

        <TableContainer sx={{ display: { xs: 'none', md: 'block' }, maxHeight: { md: 'calc(100vh - 320px)' } }}>
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 3 }}>Department Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.map((r) => (
                <TableRow
                  key={r.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell sx={{ pl: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {r.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: (t) => alpha(t.palette.secondary.main, 0.08),
                        color: 'secondary.main',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {r.location}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      {isMdUp ? (
                        <IconButton
                          onClick={() => openEdit(r)}
                          aria-label="Edit department"
                          size="small"
                          sx={{ color: 'text.secondary', '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.05) } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton
                          component={RouterLink}
                          to={`/departments/${r.id}/edit`}
                          aria-label="Edit department"
                          size="small"
                          sx={{ color: 'text.secondary', '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.05) } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="Delete department"
                        size="small"
                        onClick={() => setDepartmentToDelete({ id: r.id, name: r.name })}
                        sx={{ color: 'error.main', '&:hover': { bgcolor: (t) => alpha(t.palette.error.main, 0.08) } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} sx={{ py: 10, textAlign: 'center' }}>
                    <Typography color="text.secondary" variant="body2">
                      No departments found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ px: { xs: 1.25, sm: 2, md: 3 }, pb: { xs: 1.5, sm: 2 } }}>
          <DataTablePagination
            page={page}
            onPageChange={setPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(n) => {
              setRowsPerPage(n);
              setPage(0);
            }}
            total={filtered.length}
          />
        </Box>
      </Paper>

      <DepartmentDialog open={dialogActive} onClose={() => setDialogOpen(false)} initial={editing} onSaved={load} />

      <ConfirmDialog
        open={Boolean(departmentToDelete)}
        onClose={() => setDepartmentToDelete(null)}
        title="Delete department?"
        description={
          departmentToDelete
            ? `“${departmentToDelete.name}” will be removed. Employees linked to this department may need to be reassigned. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!departmentToDelete) return;
          await api.delete(`/api/departments/${departmentToDelete.id}`);
          await load();
          notifySuccess('Department deleted.');
        }}
      />
    </Box>
  );
}

function DepartmentDialog({ open, onClose, initial, onSaved }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: '', location: '' } });

  useEffect(() => {
    if (open) {
      reset({
        name: initial?.name || '',
        location: initial?.location || '',
      });
    }
  }, [open, initial, reset]);

  const onSubmit = async (values) => {
    try {
      if (initial) {
        await api.put(`/api/departments/${initial.id}`, values);
        notifySuccess('Department updated.');
      } else {
        await api.post('/api/departments', values);
        notifySuccess('Department created.');
      }
      await onSaved();
      onClose();
    } catch (e) {
      if (e.fieldErrors) {
        Object.entries(e.fieldErrors).forEach(([k, v]) => setError(k, { type: 'server', message: v }));
        notifyFieldErrors(e.fieldErrors);
      } else {
        notifyError(e.message);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      fullScreen={fullScreen}
      PaperProps={{
        sx: { borderRadius: { sm: 1 } },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>
        {initial ? 'Edit Department' : 'New Department'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit, notifyFirstFormValidationError)} noValidate>
        <DialogContent sx={{ py: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Department Name"
            placeholder="e.g. Engineering"
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' } })}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Location"
            placeholder="e.g. San Francisco, CA"
            error={!!errors.location}
            helperText={errors.location?.message}
            {...register('location', { required: 'Required' })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ px: 3 }}>
            {isSubmitting ? 'Saving…' : 'Save Department'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

