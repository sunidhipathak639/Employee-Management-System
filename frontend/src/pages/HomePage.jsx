import BusinessIcon from '@mui/icons-material/Business';
import GroupsIcon from '@mui/icons-material/Groups';
import SecurityIcon from '@mui/icons-material/Security';
import AddIcon from '@mui/icons-material/Add';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
  Skeleton,
} from '@mui/material';
import DepartmentInsightsCharts from '../components/DepartmentInsightsCharts';
import { Link as RouterLink, Navigate, useOutletContext } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';
import api, { unwrap } from '../api';
import { useAuthStore } from '../store/authStore';

function StatCard({ title, value, icon, color, to, loading }) {
  return (
    <Card
      component={RouterLink}
      to={to}
      sx={{
        textDecoration: 'none',
        height: '100%',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(color, 0.12)}`,
          borderColor: alpha(color, 0.3),
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
        <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} alignItems="center">
          <Box
            sx={{
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              borderRadius: 1,
              bgcolor: alpha(color, 0.1),
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
            {loading ? (
              <Skeleton width={56} height={28} sx={{ maxWidth: '100%' }} />
            ) : (
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -1, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {value ?? 0}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const theme = useTheme();
  const token = useAuthStore((s) => s.token);
  const username = useAuthStore((s) => s.username);
  const { setShell } = useOutletContext() ?? {};
  const [stats, setStats] = useState({ employees: 0, departments: 0, roles: 0 });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (!setShell || !token) return undefined;
    setShell({
      title: 'Home',
      subtitle: username ? `Welcome back, ${username}` : 'Your workspace',
      actions: null,
      filterBar: null,
    });
    return () => setShell(null);
  }, [setShell, token, username]);

  useEffect(() => {
    if (!token) {
      setEmployees([]);
      setLoading(false);
      return;
    }
    const fetchStats = async () => {
      try {
        const [emp, dep, rol] = await Promise.all([
          api.get('/api/employees').then(unwrap),
          api.get('/api/departments').then(unwrap),
          api.get('/api/roles').then(unwrap),
        ]);
        setEmployees(Array.isArray(emp) ? emp : []);
        setStats({
          employees: emp.length,
          departments: dep.length,
          roles: rol.length,
        });
      } catch (e) {
        console.error('Failed to fetch stats', e);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box>
      <Box sx={{ display: { xs: 'none', md: 'block' }, mb: { md: 6 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontSize: { md: '2rem' } }}>
          Welcome back, {username} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.9375rem' }}>
          Here's what's happening with your organization today.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: { xs: 3, sm: 4, md: 6 }, mt: { xs: 0.5, md: 0 } }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Employees"
            value={stats.employees}
            icon={<GroupsIcon />}
            color={theme.palette.primary.main}
            to="/employees"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Departments"
            value={stats.departments}
            icon={<BusinessIcon />}
            color={theme.palette.secondary.main}
            to="/departments"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Job Roles"
            value={stats.roles}
            icon={<SecurityIcon />}
            color={theme.palette.success.main}
            to="/roles"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: { xs: 1.5, sm: 2, md: 3 }, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
        Quick Actions
      </Typography>
      <Grid container spacing={{ xs: 1.25, sm: 2 }} justifyContent="flex-end">
        {[
          { label: 'Add Employee', to: '/employees/new', icon: <AddIcon />, bg: theme.palette.primary.main },
          { label: 'Manage Roles', to: '/roles', icon: <SecurityIcon />, bg: theme.palette.success.main },
          { label: 'Insights & charts', to: '/dashboard', icon: <AnalyticsIcon />, bg: theme.palette.secondary.main },
        ].map((action) => (
          <Grid item xs={12} sm={4} key={action.label}>
            <Button
              fullWidth
              variant="outlined"
              component={RouterLink}
              to={action.to}
              startIcon={action.icon}
              sx={{
                justifyContent: 'flex-end',
                py: { xs: 1.25, sm: 1.75, md: 2 },
                px: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: 1,
                borderWidth: 2,
                '&:hover': { borderWidth: 2, bgcolor: alpha(action.bg, 0.04) },
              }}
            >
              {action.label}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: { xs: 4, sm: 5, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          gap={{ xs: 1.5, sm: 2 }}
          sx={{ mb: { xs: 1.5, sm: 2 } }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.125rem' } }}>
              Insights & charts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mt: 0.5, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Headcount, workforce mix, and average salary by department (same data as the Insights page).
            </Typography>
          </Box>
          <Button variant="outlined" size="small" component={RouterLink} to="/dashboard" sx={{ alignSelf: { sm: 'center' }, flexShrink: 0 }}>
            Open full Insights
          </Button>
        </Stack>
        {loading ? (
          <Skeleton variant="rounded" height={220} sx={{ borderRadius: 1, '@media (min-width: 600px)': { height: 280 }, '@media (min-width: 900px)': { height: 320 } }} />
        ) : (
          <DepartmentInsightsCharts employees={employees} compact chartAnimKey={stats.employees} />
        )}
      </Box>
    </Box>
  );
}

