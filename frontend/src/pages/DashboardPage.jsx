import RefreshIcon from '@mui/icons-material/Refresh';
import { Avatar, Box, IconButton, Paper, Typography, alpha, useTheme } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import api, { unwrap } from '../api';
import { notifyError, notifySuccess } from '../notify';
import DepartmentInsightsCharts from '../components/DepartmentInsightsCharts';
import LoadingState from '../components/LoadingState';
import PageHeader from '../components/PageHeader';
import { useAuthStore } from '../store/authStore';

export default function DashboardPage() {
  const theme = useTheme();
  const username = useAuthStore((s) => s.username);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartAnimKey, setChartAnimKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/employees');
      setEmployees(unwrap(res));
    } catch (e) {
      notifyError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadCharts = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await api.get('/api/employees');
      setEmployees(unwrap(res));
      setChartAnimKey((k) => k + 1);
      notifySuccess('Insights data refreshed.');
    } catch (e) {
      notifyError(e.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return <LoadingState label="Loading dashboard data…" />;
  }

  return (
    <Box>
      <PageHeader
        title="Insights"
        description="Live charts from your employee directory: headcount and compensation by department. Charts animate on load and when data refreshes."
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: { xs: 2, md: 2.5 } }}>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            pl: 0.75,
            pr: 0.5,
            py: 0.5,
            borderRadius: 999,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            boxShadow: `0 1px 4px ${alpha('#000', theme.palette.mode === 'dark' ? 0.2 : 0.06)}`,
            maxWidth: '100%',
          }}
        >
          {username && (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.8rem',
                fontWeight: 800,
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
              }}
              aria-hidden
            >
              {username.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, pr: 0.25 }}>
            {employees.length} employee{employees.length === 1 ? '' : 's'}
          </Typography>
          <IconButton
            aria-label="Refresh charts and replay animations"
            onClick={() => reloadCharts()}
            disabled={loading || refreshing}
            size="small"
            color="primary"
            sx={{
              bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.12 : 0.08),
              '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.18) },
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Paper>
      </Box>

      <DepartmentInsightsCharts employees={employees} chartAnimKey={chartAnimKey} compact={false} />
    </Box>
  );
}
