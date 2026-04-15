import {
  Box,
  Card,
  CardContent,
  IconButton,
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
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentIndOutlined';
import SearchIcon from '@mui/icons-material/SearchOutlined';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import api, { unwrap } from '../api';
import { notifyError, notifySuccess } from '../notify';
import ConfirmDialog from '../components/ConfirmDialog';
import EmployeeDialog from '../components/EmployeeDialog';
import DataTablePagination from '../components/DataTablePagination';
import LoadingState from '../components/LoadingState';
import HeaderContainedAddButton from '../components/HeaderContainedAddButton';
import PageHeader from '../components/PageHeader';

export default function EmployeesPage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const dialogActive = dialogOpen && isMdUp;
  const openCreate = () => {
    setEditingEmployeeId(null);
    setDialogOpen(true);
  };
  const openEdit = (id) => {
    setEditingEmployeeId(id);
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setEditingEmployeeId(null);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/employees');
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
      (r) =>
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(s) ||
        r.email.toLowerCase().includes(s) ||
        (r.department?.name && r.department.name.toLowerCase().includes(s))
    );
  }, [rows, q]);

  const pageRows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const mobileFilterBar = useMemo(
    () => (
      <TextField
        fullWidth
        size="small"
        placeholder="Search name, email, dept…"
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
    return <LoadingState label="Loading employees…" />;
  }

  return (
    <Box>
      <PageHeader
        title={
          dialogActive
            ? editingEmployeeId != null
              ? 'Update Profile'
              : 'New Employee'
            : 'Employees'
        }
        description={
          dialogActive
            ? 'Enter the professional details for this workforce member.'
            : 'Manage your workforce directory and role assignments.'
        }
        hideHeaderAvatar
        filterBar={dialogActive ? null : mobileFilterBar}
        actions={
          dialogActive ? (
            <IconButton aria-label="Close" onClick={closeDialog} size="small" color="inherit">
              <CloseIcon />
            </IconButton>
          ) : isMdUp ? (
            <HeaderContainedAddButton label="Add employee" onClick={openCreate}>
              Add Employee
            </HeaderContainedAddButton>
          ) : (
            <HeaderContainedAddButton label="Add employee" component={RouterLink} to="/employees/new">
              Add Employee
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
            placeholder="Search by name, email, or department..."
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
              sx: { borderRadius: 1, bgcolor: 'background.paper' }
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
                overflow: 'visible',
                bgcolor: (t) => alpha(t.palette.background.default, t.palette.mode === 'dark' ? 0.2 : 0.5),
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Stack spacing={1.25}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                        {r.firstName} {r.lastName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5, wordBreak: 'break-word', lineHeight: 1.45 }}
                      >
                        {r.email}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0, mt: -0.25 }}>
                      <IconButton
                        component={RouterLink}
                        to={`/employees/${r.id}/roles`}
                        aria-label="Manage roles"
                        size="small"
                        sx={{ color: 'primary.main', '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) } }}
                      >
                        <AssignmentIndIcon fontSize="small" />
                      </IconButton>
                      {isMdUp ? (
                        <IconButton
                          aria-label="Edit employee"
                          size="small"
                          onClick={() => openEdit(r.id)}
                          sx={{ color: 'text.secondary', '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.05) } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton
                          component={RouterLink}
                          to={`/employees/${r.id}/edit`}
                          aria-label="Edit employee"
                          size="small"
                          sx={{ color: 'text.secondary', '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.05) } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="Delete employee"
                        size="small"
                        onClick={() => setEmployeeToDelete({ id: r.id, name: `${r.firstName} ${r.lastName}` })}
                        sx={{ color: 'error.main', '&:hover': { bgcolor: (t) => alpha(t.palette.error.main, 0.08) } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                        color: 'primary.main',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        maxWidth: '100%',
                      }}
                    >
                      {r.department?.name || 'Unassigned'}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'text.primary' }}>
                      {r.salary != null ? Number(r.salary).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '—'}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
          {pageRows.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography color="text.secondary" variant="body2">
                No employees found matching your criteria.
              </Typography>
            </Box>
          )}
        </Stack>

        <TableContainer
          sx={{
            display: { xs: 'none', md: 'block' },
            maxHeight: { md: 'calc(100vh - 320px)' },
          }}
        >
          <Table stickyHeader size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 3 }}>Name</TableCell>
                <TableCell>Email Address</TableCell>
                <TableCell>Department</TableCell>
                <TableCell align="right">Salary</TableCell>
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
                      {r.firstName} {r.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {r.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                        color: 'primary.main',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      {r.department?.name || 'Unassigned'}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {r.salary != null ? Number(r.salary).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      <IconButton
                        component={RouterLink}
                        to={`/employees/${r.id}/roles`}
                        aria-label="Manage roles"
                        size="small"
                        sx={{ color: 'primary.main', '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.08) } }}
                      >
                        <AssignmentIndIcon fontSize="small" />
                      </IconButton>
                      {isMdUp ? (
                        <IconButton
                          aria-label="Edit employee"
                          size="small"
                          onClick={() => openEdit(r.id)}
                          sx={{ color: 'text.secondary', '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.05) } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton
                          component={RouterLink}
                          to={`/employees/${r.id}/edit`}
                          aria-label="Edit employee"
                          size="small"
                          sx={{ color: 'text.secondary', '&:hover': { bgcolor: (t) => alpha(t.palette.text.primary, 0.05) } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="Delete employee"
                        size="small"
                        onClick={() => setEmployeeToDelete({ id: r.id, name: `${r.firstName} ${r.lastName}` })}
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
                  <TableCell colSpan={5} sx={{ py: 10, textAlign: 'center' }}>
                    <Typography color="text.secondary" variant="body2">
                      No employees found matching your criteria.
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

      <EmployeeDialog
        open={dialogActive}
        onClose={closeDialog}
        employeeId={editingEmployeeId}
        onSaved={load}
      />

      <ConfirmDialog
        open={Boolean(employeeToDelete)}
        onClose={() => setEmployeeToDelete(null)}
        title="Delete employee?"
        description={
          employeeToDelete
            ? `This will permanently remove ${employeeToDelete.name} from the directory. This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!employeeToDelete) return;
          await api.delete(`/api/employees/${employeeToDelete.id}`);
          await load();
          notifySuccess('Employee deleted.');
        }}
      />
    </Box>
  );
}
