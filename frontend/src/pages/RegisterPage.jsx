import Visibility from '@mui/icons-material/VisibilityOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import api, { unwrap } from '../api';
import AuthDialogLayout from '../components/AuthDialogLayout';
import { authTextFieldSx } from '../components/authFormStyles';
import { notifyError, notifyFieldErrors, notifyFirstFormValidationError, notifySuccess } from '../notify';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { username: '', password: '' } });

  if (token) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values) => {
    try {
      const res = await api.post('/api/auth/register', values);
      const data = unwrap(res);
      setAuth(data.token, data.username);
      notifySuccess('Account created. Welcome!');
      queueMicrotask(() => navigate('/employees'));
    } catch (e) {
      if (e.fieldErrors) {
        Object.entries(e.fieldErrors).forEach(([field, message]) => {
          if (['username', 'password'].includes(field)) {
            setError(field, { type: 'server', message });
          }
        });
        notifyFieldErrors(e.fieldErrors);
      } else {
        notifyError(e.message);
      }
    }
  };

  const fieldSx = authTextFieldSx(theme);

  return (
    <AuthDialogLayout
      title="Create Account"
      subtitle="Join to manage your workspace"
      onRequestClose={() => navigate('/login', { replace: true })}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit, notifyFirstFormValidationError)}
        noValidate
        id="register-form"
        sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
      >
        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Username"
            placeholder="jane_doe"
            autoComplete="username"
            autoFocus
            error={!!errors.username}
            helperText={errors.username?.message}
            sx={fieldSx}
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'At least 3 characters' },
            })}
          />
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={fieldSx}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'At least 6 characters' },
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                    size="small"
                    sx={{ color: 'text.secondary' }}
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="medium"
          disabled={isSubmitting}
          sx={{
            mt: 1.75,
            py: 1.1,
            borderRadius: 999,
            fontWeight: 700,
            fontSize: '0.9375rem',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { boxShadow: theme.shadows[2] },
          }}
        >
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.75, textAlign: 'center', fontSize: '0.8125rem' }}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Log in
          </Link>
        </Typography>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Typography
            variant="caption"
            component="p"
            color="text.secondary"
            sx={{
              m: 0,
              px: 0.5,
              textAlign: 'center',
              lineHeight: 1.55,
              fontSize: '0.7rem',
              opacity: 0.88,
            }}
          >
            By joining, you agree to our Terms and Privacy Policy.
          </Typography>
        </Box>
      </Box>
    </AuthDialogLayout>
  );
}
