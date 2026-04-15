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
import { notifyError, notifyFirstFormValidationError, notifyInfo, notifySuccess } from '../notify';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { username: '', password: '' } });

  if (token) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (values) => {
    try {
      const res = await api.post('/api/auth/login', values);
      const data = unwrap(res);
      setAuth(data.token, data.username);
      notifySuccess('Signed in successfully.');
      queueMicrotask(() => navigate('/employees'));
    } catch (e) {
      notifyError(e.message);
    }
  };

  const fieldSx = authTextFieldSx(theme);

  return (
    <AuthDialogLayout
      title="Login"
      subtitle="Sign in to manage your workspace and team."
      showDemoCredentials
      onRequestClose={() => navigate('/register', { replace: true })}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit, notifyFirstFormValidationError)}
        noValidate
        id="login-form"
        sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
      >
        <Stack spacing={2}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Username"
            placeholder="e.g. admin"
            autoComplete="username"
            autoFocus
            error={!!errors.username}
            helperText={errors.username?.message}
            sx={fieldSx}
            {...register('username', { required: 'Username is required' })}
          />
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={fieldSx}
            {...register('password', { required: 'Password is required' })}
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

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.25 }}>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={() => notifyInfo('Password reset is not available in this demo.')}
            sx={{
              fontWeight: 600,
              fontSize: '0.8125rem',
              color: 'primary.main',
              textDecoration: 'none',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              p: 0,
              font: 'inherit',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Forgot password?
          </Link>
        </Box>

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
          {isSubmitting ? 'Signing in…' : 'Login'}
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.75, textAlign: 'center', fontSize: '0.8125rem' }}>
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to="/register" underline="hover" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Sign up
          </Link>
        </Typography>

        <Box sx={{ mt: 'auto', minHeight: { xs: 8, sm: 12 } }} aria-hidden />
      </Box>
    </AuthDialogLayout>
  );
}
