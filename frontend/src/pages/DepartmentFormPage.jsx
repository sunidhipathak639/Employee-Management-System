import { Box, Button, IconButton, Paper, Stack, TextField, Typography, alpha, useMediaQuery, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import api, { unwrap } from '../api';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { notifyError, notifyFieldErrors, notifyFirstFormValidationError, notifySuccess } from '../notify';

export default function DepartmentFormPage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);

  useLayoutEffect(() => {
    if (isMdUp) {
      navigate('/departments', { replace: true });
    }
  }, [isMdUp, navigate]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: '', location: '' } });

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/departments/${id}`);
        const d = unwrap(res);
        if (cancelled) return;
        reset({ name: d.name || '', location: d.location || '' });
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
    try {
      if (isEdit) {
        await api.put(`/api/departments/${id}`, values);
        notifySuccess('Department updated.');
      } else {
        await api.post('/api/departments', values);
        notifySuccess('Department created.');
      }
      queueMicrotask(() => navigate('/departments'));
    } catch (e) {
      if (e.fieldErrors) {
        Object.entries(e.fieldErrors).forEach(([k, v]) => setError(k, { type: 'server', message: v }));
        notifyFieldErrors(e.fieldErrors);
      } else {
        notifyError(e.message);
      }
    }
  };

  if (isMdUp) {
    return <LoadingState label="Opening departments…" />;
  }

  if (loading) {
    return <LoadingState label="Loading department…" />;
  }

  return (
    <Box>
      <PageHeader
        title={isEdit ? 'Edit Department' : 'New Department'}
        description={
          isEdit ? 'Update name and location for this organizational unit.' : 'Add an organizational unit and office location.'
        }
        hideHeaderAvatar
        actions={
          <IconButton
            component={RouterLink}
            to="/departments"
            color="inherit"
            aria-label="Back to all departments"
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
          boxShadow: `0 8px 32px ${alpha(theme.palette.background.paper, 0.4)}`,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: { xs: 2.5, sm: 3, md: 4 },
            letterSpacing: -0.5,
            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
          }}
        >
          Department details
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit, notifyFirstFormValidationError)} noValidate>
          <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            <TextField
              fullWidth
              label="Department Name"
              placeholder="e.g. Engineering"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' } })}
            />
            <TextField
              fullWidth
              label="Location"
              placeholder="e.g. San Francisco, CA"
              error={!!errors.location}
              helperText={errors.location?.message}
              {...register('location', { required: 'Required' })}
            />
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
              onClick={() => navigate('/departments')}
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
              {isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create department'}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
