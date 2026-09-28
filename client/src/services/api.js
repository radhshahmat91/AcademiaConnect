import axios from 'axios';

const FALLBACK_API_URL = 'http://localhost:5000/api';
const FALLBACK_SERVER_URL = 'http://localhost:5000';

const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

/**
 * Accept both:
 *   https://your-api.onrender.com
 *   https://your-api.onrender.com/api
 *
 * This prevents a very common deployment bug where the frontend calls
 * /auth/login instead of /api/auth/login.
 */
const rawApiUrl = import.meta.env.VITE_API_URL?.trim() || FALLBACK_API_URL;
const API_URL = `${trimTrailingSlash(rawApiUrl).replace(/\/api$/i, '')}/api`;

const rawServerUrl = import.meta.env.VITE_SERVER_URL?.trim();
export const SERVER_URL = trimTrailingSlash(
  (rawServerUrl || API_URL).replace(/\/api$/i, ''),
);

const api = axios.create({
  baseURL: API_URL,
  // Give a sleeping/cold backend enough time to start and connect to MongoDB.
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the saved token to every request, if we have one.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ac_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is rejected or expired, clear it and send the user back to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ac_token');
      localStorage.removeItem('ac_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Builds a full URL for a file stored under the backend's /uploads folder.
// Passes external URLs (http/https, e.g. YouTube links) straight through.
export const fileUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${SERVER_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const isNetworkError = (error) => !error?.response;

// Retry only requests that received no HTTP response. Login is safe to retry;
// avoid applying this blindly to mutating requests such as registration.
export const withNetworkRetry = async (request, retries = 1, delayMs = 750) => {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;
      if (!isNetworkError(error) || attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
};

export { API_URL };
export default api;
