import { Box, Paper, Stack, Typography, alpha, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { buildDepartmentStats } from '../utils/departmentStats';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const PIE_ANIMATION = { isAnimationActive: true, animationDuration: 1000, animationBegin: 120, animationEasing: 'ease-out' };
const BAR_ANIMATION = { isAnimationActive: true, animationDuration: 900, animationBegin: 0, animationEasing: 'ease-out' };
const TOOLTIP_MOTION = { isAnimationActive: 'auto', animationDuration: 320, animationEasing: 'ease-out' };

/**
 * Recharts department headcount + share + avg salary. Used on Home (compact) and Insights page (full).
 */
export default function DepartmentInsightsCharts({
  employees = [],
  chartAnimKey = 0,
  compact = false,
}) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const chartData = useMemo(() => buildDepartmentStats(employees), [employees]);

  const pieColors = useMemo(() => {
    const base = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.error.main,
      alpha(theme.palette.primary.main, 0.55),
      alpha(theme.palette.secondary.main, 0.55),
    ];
    return chartData.map((_, i) => base[i % base.length]);
  }, [chartData, theme.palette]);

  const tickSize = isXs ? 10 : 12;
  const axisTick = { fill: theme.palette.text.secondary, fontSize: tickSize };
  const gridStroke = theme.palette.divider;
  const tooltipStyle = {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '8px',
    color: theme.palette.text.primary,
  };

  const chartH = compact
    ? isXs
      ? 200
      : 260
    : isXs
      ? 220
      : 340;
  const barBottom = isXs ? 56 : 48;
  const yAxisWidth = isXs ? 88 : 120;
  const salaryRow = compact ? (isXs ? 40 : 44) : isXs ? 46 : 52;

  return (
    <Box>
      {chartData.length === 0 ? (
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography color="text.secondary">
            {compact
              ? 'Add at least one employee to see headcount and salary charts here.'
              : 'Add employees with departments to see charts.'}
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={{ xs: 1.5, sm: 2, md: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
              gap: { xs: 1.5, sm: 2, md: 3 },
              alignItems: 'stretch',
            }}
          >
            <Paper sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' } }}>
                Headcount by department
              </Typography>
              {!compact && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Animated bars (ease-out). Resize the window — charts stay fluid inside the card.
                </Typography>
              )}
              <Box sx={{ width: '100%', height: chartH }}>
                <ResponsiveContainer key={`headcount-${chartAnimKey}`}>
                  <BarChart data={chartData} margin={{ top: 6, right: isXs ? 4 : 8, left: isXs ? -12 : -8, bottom: barBottom }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={axisTick}
                      interval={0}
                      angle={isXs ? -40 : -28}
                      textAnchor="end"
                      height={isXs ? 62 : 70}
                      tickMargin={isXs ? 4 : 8}
                    />
                    <YAxis allowDecimals={false} tick={axisTick} width={40} />
                    <Tooltip
                      {...TOOLTIP_MOTION}
                      cursor={{ fill: alpha(theme.palette.primary.main, 0.12) }}
                      contentStyle={tooltipStyle}
                      formatter={(value, name) => [value, name === 'count' ? 'Employees' : name]}
                    />
                    <Bar
                      dataKey="count"
                      name="Employees"
                      fill={theme.palette.primary.main}
                      radius={[4, 4, 0, 0]}
                      {...BAR_ANIMATION}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <Paper sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' } }}>
                Share of workforce
              </Typography>
              {!compact && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Donut chart with staggered sector animation and legend.
                </Typography>
              )}
              <Box sx={{ width: '100%', height: chartH }}>
                <ResponsiveContainer key={`share-${chartAnimKey}`}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius="48%"
                      outerRadius="78%"
                      paddingAngle={2}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      {...PIE_ANIMATION}
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index]} stroke={theme.palette.background.paper} strokeWidth={1} />
                      ))}
                    </Pie>
                    <Tooltip {...TOOLTIP_MOTION} contentStyle={tooltipStyle} formatter={(value) => [`${value} people`, 'Count']} />
                    <Legend wrapperStyle={{ fontSize: tickSize, color: theme.palette.text.secondary }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>

          <Paper sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' } }}>
              Average salary by department
            </Typography>
            {!compact && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Horizontal bars for easier label reading on small screens.
              </Typography>
            )}
            <Box sx={{ width: '100%', height: Math.max(compact ? (isXs ? 200 : 220) : isXs ? 240 : 280, chartData.length * salaryRow) }}>
              <ResponsiveContainer key={`salary-${chartAnimKey}`}>
                <BarChart
                  layout="vertical"
                  data={chartData}
                  margin={{ top: 6, right: isXs ? 12 : 24, left: isXs ? 4 : 8, bottom: 6 }}
                  barCategoryGap={isXs ? 8 : 12}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                  <XAxis type="number" tick={axisTick} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
                  <YAxis type="category" dataKey="name" tick={axisTick} width={yAxisWidth} tickMargin={4} />
                  <Tooltip
                    {...TOOLTIP_MOTION}
                    cursor={{ fill: alpha(theme.palette.secondary.main, 0.1) }}
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Avg salary']}
                  />
                  <Bar
                    dataKey="avgSalary"
                    name="Avg salary"
                    fill={theme.palette.secondary.main}
                    radius={[0, 4, 4, 0]}
                    {...BAR_ANIMATION}
                    animationBegin={200}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Stack>
      )}
    </Box>
  );
}
