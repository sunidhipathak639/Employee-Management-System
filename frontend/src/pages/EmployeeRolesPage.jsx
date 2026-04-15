import {
  Box,
  Button,
  IconButton,
  MenuItem,
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
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useParams } from 'react-router-dom';
import api, { unwrap } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { notifyError, notifyFieldErrors, notifyFirstFormValidationError, notifySuccess } from '../notify';

export default function EmployeeRolesPage() {
  const theme = useTheme();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignmentToRemove, setAssignmentToRemove] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [er, emp, rl] = await Promise.all([
        api.get(`/api/employees/${id}/roles`),
        api.get(`/api/employees/${id}`),
        api.get('/api/roles'),
      ]);
      setAssignments(unwrap(er));
      setEmployee(unwrap(emp));
      setRoles(unwrap(rl));
    } catch (e) {
      notifyError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { roleId: '', assignedDate: '' } });

  const onAssign = async (values) => {
    try {
      const payload = {
        roleId: Number(values.roleId),
        assignedDate: values.assignedDate || undefined,
      };
      await api.post(`/api/employees/${id}/roles`, payload);
      reset({ roleId: '', assignedDate: '' });
      await load();
      notifySuccess('Role assigned.');
    } catch (e) {
      if (e.fieldErrors) {
        Object.entries(e.fieldErrors).forEach(([k, v]) => setError(k, { type: 'server', message: v }));
        notifyFieldErrors(e.fieldErrors);
      } else {
        notifyError(e.message);
      }
    }
  };

  if (loading) {
    return <LoadingState label="Loading assignments…" />;
  }

  return (
    <Box>
      <PageHeader
        title={`Role Assignments`}
        description={employee ? `Manage roles for ${employee.firstName} ${employee.lastName}` : "Manage employee roles"}
        hideHeaderAvatar
        actions={
          <IconButton
            component={RouterLink}
            to="/employees"
            color="inherit"
            aria-label="Back to all employees"
            size="small"
          >
            <ArrowBackIcon />
          </IconButton>
        }
      />

      <Paper 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          mb: { xs: 2.5, sm: 3, md: 4 }, 
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: (t) => alpha(t.palette.background.default, 0.4)
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, mb: { xs: 2, sm: 2.5, md: 3 }, letterSpacing: -0.5, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
          Assign New Role
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onAssign, notifyFirstFormValidationError)}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 2 }}
            alignItems={{ xs: 'stretch', sm: 'flex-end' }}
            justifyContent={{ sm: 'flex-end' }}
            flexWrap="wrap"
          >
            <TextField
              select
              label="Select Role"
              error={!!errors.roleId}
              helperText={errors.roleId?.message}
              sx={{ flex: { sm: '1 1 220px' }, minWidth: { xs: '100%', sm: 200 }, bgcolor: 'background.paper' }}
              {...register('roleId', { required: 'Pick a role' })}
            >
              <MenuItem value="">
                <em>Select a role</em>
              </MenuItem>
              {roles.map((r) => (
                <MenuItem key={r.id} value={String(r.id)}>
                  {r.title} (Grade {r.payGrade})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              label="Assignment Date (Optional)"
              InputLabelProps={{ shrink: true }}
              sx={{ flex: { sm: '0 1 200px' }, minWidth: { xs: '100%', sm: 160 }, bgcolor: 'background.paper' }}
              {...register('assignedDate')}
            />
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSubmitting} 
              startIcon={<AddIcon />}
              sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 140 }, py: 1 }}
            >
              {isSubmitting ? 'Assigning…' : 'Assign Role'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: { xs: 1.25, sm: 2 }, letterSpacing: -0.5, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
        Current Roles
      </Typography>
      
      <Paper 
        sx={{ 
          borderRadius: 1,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <TableContainer sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxHeight: { xs: 'min(48vh, 320px)', sm: 'none' } }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: { xs: 1.25, sm: 3 } }}>Role</TableCell>
                <TableCell>Pay Grade</TableCell>
                <TableCell>Assigned Date</TableCell>
                <TableCell align="right" sx={{ pr: { xs: 1.25, sm: 3 } }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((a) => (
                <TableRow 
                  key={a.id} 
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell sx={{ pl: { xs: 1.25, sm: 3 }, fontWeight: 700 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {a.role?.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        px: { xs: 1, sm: 1.5 },
                        py: { xs: 0.25, sm: 0.5 },
                        borderRadius: 1,
                        bgcolor: (t) => alpha(t.palette.success.main, 0.08),
                        color: 'success.main',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                      }}
                    >
                      Grade {a.role?.payGrade}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {a.assignedDate}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: { xs: 1.25, sm: 3 } }}>
                    <IconButton
                      size="small"
                      aria-label="Remove role assignment"
                      onClick={() =>
                        setAssignmentToRemove({ roleId: a.role.id, title: a.role?.title || 'Role' })
                      }
                      sx={{ color: 'error.main', '&:hover': { bgcolor: (t) => alpha(t.palette.error.main, 0.08) } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {assignments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ py: { xs: 4, sm: 6, md: 8 }, textAlign: 'center' }}>
                    <Typography color="text.secondary" variant="body2" sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                      No roles currently assigned.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ConfirmDialog
        open={Boolean(assignmentToRemove)}
        onClose={() => setAssignmentToRemove(null)}
        title="Remove role assignment?"
        description={
          assignmentToRemove
            ? `Remove “${assignmentToRemove.title}” from this employee? You can assign it again later.`
            : ''
        }
        confirmLabel="Remove"
        onConfirm={async () => {
          if (!assignmentToRemove) return;
          await api.delete(`/api/employees/${id}/roles/${assignmentToRemove.roleId}`);
          await load();
          notifySuccess('Role assignment removed.');
        }}
      />
    </Box>
  );
}

