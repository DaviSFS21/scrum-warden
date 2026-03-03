import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user, token, isLoading } = useAuth();

  if (isLoading) return <div className="p-8 text-center">Carregando...</div>;
  if (!user || !token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Role not authorized
  }

  return <Outlet />;
};
