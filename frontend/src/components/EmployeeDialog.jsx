import SaveIcon from '@mui/icons-material/SaveOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api, { unwrap } from '../api';
import { notifyError, notifyFieldErrors, notifyFirstFormValidationError, notifySuccess } from '../notify';

/**
 * Desktop create/edit employee in a modal (mobile uses routed {@link ../pages/EmployeeFormPage}).
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {number | null} props.employeeId null = create, id = edit
 * @param {() => void | Promise<void>} props.onSaved
 */
export default function EmployeeDialog({ open, onClose, employeeId, onSaved }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = employeeId != null;
  const [departments, setDepartments] = useState([]);
  const [loadingEmployee, setLoadingEmployee] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      salary: '',
      departmentId: '',
    },
  });

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/api/departments');
        if (!cancelled) setDepartments(unwrap(res));
      } catch (e) {
        if (!cancelled) notifyError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!isEdit) {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        salary: '',
        departmentId: '',
      });
      setLoadingEmployee(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadingEmployee(true);
      try {
        const res = await api.get(`/api/employees/${employeeId}`);
        const e = unwrap(res);
        if (cancelled) return;
        reset({
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.email,
          salary: String(e.salary),
          departmentId: String(e.department?.id ?? ''),
        });
      } catch (err) {
        if (!cancelled) notifyError(err.message);
      } finally {
        if (!cancelled) setLoadingEmployee(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, employeeId, isEdit, reset]);

  const onSubmit = async (values) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      salary: Number(values.salary),
      departmentId: Number(values.departmentId),
    };
    try {
      if (isEdit) {
        await api.put(`/api/employees/${employeeId}`, payload);
        notifySuccess('Employee updated.');
      } else {
        await api.post('/api/employees', payload);
        notifySuccess('Employee created.');
      }
      await onSaved();
      onClose();
    } catch (e) {
      if (e.fieldErrors) {
        Object.entries(e.fieldErrors).forEach(([k, v]) => {
          if (['firstName', 'lastName', 'email', 'salary', 'departmentId'].includes(k)) {
            setError(k, { type: 'server', message: v });
          }
        });
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
      maxWidth="sm"
      fullScreen={fullScreen}
      scroll="paper"
      PaperProps={{
        sx: { borderRadius: fullScreen ? 0 : 1 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pt: 2.5 }}>
        {isEdit ? 'Update Profile' : 'New Employee'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit, notifyFirstFormValidationError)} noValidate>
        <DialogContent sx={{ pt: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the professional details for this workforce member.
          </Typography>
          {loadingEmployee ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
              Loading employee…
            </Typography>
          ) : (
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="First Name"
                  placeholder="John"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  {...register('firstName', { required: 'Required' })}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  placeholder="Doe"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  {...register('lastName', { required: 'Required' })}
                />
              </Stack>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="john.doe@company.com"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', {
                  required: 'Required',
                  pattern: { value: /.+@.+\..+/, message: 'Enter a valid email' },
                })}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Salary (USD)"
                  type="number"
                  placeholder="0.00"
                  inputProps={{ min: 0, step: '0.01' }}
                  error={!!errors.salary}
                  helperText={errors.salary?.message}
                  {...register('salary', { required: 'Required' })}
                />
                <TextField
                  fullWidth
                  select
                  label="Department"
                  error={!!errors.departmentId}
                  helperText={errors.departmentId?.message}
                  {...register('departmentId', { required: 'Required' })}
                >
                  <MenuItem value="">
                    <em>Select a department</em>
                  </MenuItem>
                  {departments.map((d) => (
                    <MenuItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1, justifyContent: 'flex-end' }}>
          <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }} disabled={loadingEmployee}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || loadingEmployee}
            startIcon={<SaveIcon />}
            sx={{ fontWeight: 700 }}
          >
            {isSubmitting ? 'Saving…' : isEdit ? 'Update Details' : 'Create Employee'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
