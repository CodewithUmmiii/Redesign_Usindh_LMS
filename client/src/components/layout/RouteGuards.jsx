import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RequireAuth = () => (useAuth().user ? <Outlet /> : <Navigate to="/login" replace />);

export function RequireRole({ roles, children }) {
  const { user } = useAuth();
  return roles.includes(user.role) ? children : <Navigate to="/dashboard" replace />;
}
