import { Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DepartmentFormPage from './pages/DepartmentFormPage';
import DepartmentsPage from './pages/DepartmentsPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeFormPage from './pages/EmployeeFormPage';
import EmployeeRolesPage from './pages/EmployeeRolesPage';
import RoleFormPage from './pages/RoleFormPage';
import RolesPage from './pages/RolesPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="departments/new" element={<DepartmentFormPage />} />
          <Route path="departments/:id/edit" element={<DepartmentFormPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="employees/new" element={<EmployeeFormPage />} />
          <Route path="employees/:id/edit" element={<EmployeeFormPage />} />
          <Route path="employees/:id/roles" element={<EmployeeRolesPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="roles/new" element={<RoleFormPage />} />
          <Route path="roles/:id/edit" element={<RoleFormPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
