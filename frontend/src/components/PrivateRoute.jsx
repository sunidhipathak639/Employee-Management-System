import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function PrivateRoute() {
  const token = useAuthStore((s) => s.token);
  const parentContext = useOutletContext();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet context={parentContext} />;
}
