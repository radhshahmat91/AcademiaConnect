import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullPage label="Checking your session..." />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
}
