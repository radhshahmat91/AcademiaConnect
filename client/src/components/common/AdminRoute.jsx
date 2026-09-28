import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage label="Checking your session..." />;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
