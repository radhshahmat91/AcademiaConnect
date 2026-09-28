import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { withNetworkRetry } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session
  const [error, setError] = useState('');

  // On first load, if a token is saved, verify it and load the current user.
  useEffect(() => {
    const token = localStorage.getItem('ac_token');
    if (!token) {
      setLoading(false);
      return;
    }
    withNetworkRetry(() => api.get('/auth/me'), 1, 750)
      .then((res) => {
        setUser(res.data);
        connectSocket(res.data._id);
      })
      .catch((err) => {
        // A temporary network/cold-start failure should not log the user out.
        // Only an explicit 401 means the saved token is invalid/expired.
        if (err.response?.status === 401) {
          localStorage.removeItem('ac_token');
          localStorage.removeItem('ac_user');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    setError('');
    try {
      const res = await withNetworkRetry(
        () => api.post('/auth/login', { email, password }),
        1,
        750,
      );
      localStorage.setItem('ac_token', res.data.token);
      setUser(res.data.user);
      connectSocket(res.data.user._id);
      return true;
    } catch (err) {
      const message = err.response?.data?.message;
      setError(
        message ||
          (!err.response
            ? 'Unable to reach the server. Check the API URL and make sure the backend is running.'
            : 'Login failed. Please try again.'),
      );
      return false;
    }
  }, []);

  const signup = useCallback(async (formData) => {
    setError('');
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('ac_token', res.data.token);
      setUser(res.data.user);
      connectSocket(res.data.user._id);
      return true;
    } catch (err) {
      const message = err.response?.data?.message;
      setError(
        message ||
          (!err.response
            ? 'Unable to reach the server. Check the API URL and make sure the backend is running.'
            : 'Sign up failed. Please try again.'),
      );
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ac_token');
    localStorage.removeItem('ac_user');
    disconnectSocket();
    setUser(null);
  }, []);

  // Lets pages update the shared user object after e.g. a profile edit, without a full reload.
  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
