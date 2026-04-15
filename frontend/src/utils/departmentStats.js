/** Aggregate employees by department for Recharts datasets. */
export function buildDepartmentStats(employees) {
  const map = new Map();
  for (const e of employees) {
    const label = e.department?.name?.trim() || 'Unassigned';
    const cur = map.get(label) || { name: label, count: 0, salarySum: 0 };
    cur.count += 1;
    cur.salarySum += Number(e.salary) || 0;
    map.set(label, cur);
  }
  return Array.from(map.values())
    .map((row) => ({
      name: row.name,
      count: row.count,
      avgSalary: row.count ? Math.round(row.salarySum / row.count) : 0,
      salarySum: row.salarySum,
    }))
    .sort((a, b) => b.count - a.count);
}
