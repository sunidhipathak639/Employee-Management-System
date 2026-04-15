import { Box, Button, IconButton, MenuItem, Paper, Stack, TextField, Typography, alpha, useMediaQuery, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import api, { unwrap } from '../api';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { notifyError, notifyFieldErrors, notifyFirstFormValidationError, notifySuccess } from '../notify';

export default function EmployeeFormPage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  useLayoutEffect(() => {
    if (isMdUp) {
      navigate('/employees', { replace: true });
    }
  }, [isMdUp, navigate]);

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
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/api/departments');
        const list = unwrap(res);
        if (!cancelled) setDepartments(list);
      } catch (e) {
        if (!cancelled) notifyError(e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/employees/${id}`);
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
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit, reset]);

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
        await api.put(`/api/employees/${id}`, payload);
        notifySuccess('Employee updated.');
      } else {
        await api.post('/api/employees', payload);
        notifySuccess('Employee created.');
      }
      queueMicrotask(() => navigate('/employees'));
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

  if (isMdUp) {
    return <LoadingState label="Opening employees…" />;
  }

  if (loading) {
    return <LoadingState label="Loading employee data…" />;
  }

  return (
    <Box>
      <PageHeader
        title={isEdit ? 'Update Profile' : 'New Employee'}
        description="Enter the professional details for this workforce member."
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
          maxWidth: 720, 
          mx: 'auto', 
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 8px 32px ${alpha(theme.palette.background.paper, 0.4)}`
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, mb: { xs: 2.5, sm: 3, md: 4 }, letterSpacing: -0.5, fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' } }}>
          Personal Information
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit, notifyFirstFormValidationError)} noValidate>
          <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
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

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 2 }}
            sx={{ mt: { xs: 3, sm: 4, md: 5 } }}
            justifyContent="flex-end"
            alignItems={{ xs: 'stretch', sm: 'center' }}
          >
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={() => navigate('/employees')}
              sx={{
                py: 1.5,
                borderRadius: 1,
                color: 'text.secondary',
                borderColor: 'divider',
                width: { xs: '100%', sm: 'auto' },
                order: { xs: 2, sm: 1 },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={<SaveIcon />}
              sx={{ py: 1.5, borderRadius: 1, width: { xs: '100%', sm: 'auto' }, order: { xs: 1, sm: 2 } }}
            >
              {isSubmitting ? 'Saving Details…' : isEdit ? 'Update Details' : 'Create Employee'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

