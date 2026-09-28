import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import useSpotlight from './hooks/useSpotlight';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Layout from './components/layout/Layout';

import Dashboard from './pages/Dashboard';
import Courses from './pages/courses/Courses';
import CourseDetail from './pages/courses/CourseDetail';
import Clubs from './pages/clubs/Clubs';
import ClubDetail from './pages/clubs/ClubDetail';
import Events from './pages/events/Events';
import EventDetail from './pages/events/EventDetail';
import Notices from './pages/Notices';
import NoticeDetail from './pages/notices/NoticeDetail';
import Messaging from './pages/messaging/Messaging';
import Profile from './pages/Profile';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ManageClubs from './pages/admin/ManageClubs';
import ManageEvents from './pages/admin/ManageEvents';
import ManageNotices from './pages/admin/ManageNotices';
import ManageUsers from './pages/admin/ManageUsers';

// Sends a logged-in user away from /login and /signup, straight to their dashboard.
function RedirectIfAuthed({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
      <Route path="/signup" element={<RedirectIfAuthed><Signup /></RedirectIfAuthed>} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />

          <Route path="/clubs" element={<Clubs />} />
          <Route path="/clubs/:id" element={<ClubDetail />} />

          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />

          <Route path="/notices" element={<Notices />} />
          <Route path="/notices/:id" element={<NoticeDetail />} />

          <Route path="/messages" element={<Messaging />} />
          <Route path="/messages/:userId" element={<Messaging />} />

          <Route path="/profile" element={<Profile />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="clubs" element={<ManageClubs />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="notices" element={<ManageNotices />} />
              <Route path="users" element={<ManageUsers />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  // One delegated pointer listener for every `.spotlight` surface in the app.
  useSpotlight();

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
