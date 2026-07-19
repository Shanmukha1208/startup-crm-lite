import axios from 'axios';
import toast from 'react-hot-toast';

// Format and normalize the API baseURL to ensure it always includes /api
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const cleanUrl = envUrl.trim().replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

// Create configured Axios instance
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * - Automatically attaches Authorization header with Bearer JWT token if available in localStorage or sessionStorage.
 * - Prevents route duplication by normalizing endpoint URLs containing redundant /api prefix.
 */
api.interceptors.request.use(
  (config) => {
    // Attach JWT Token
    const token = localStorage.getItem('crm-token') || sessionStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Normalize URL if relative and starts with /api
    if (config.url && typeof config.url === 'string' && config.url.startsWith('/api/')) {
      config.url = config.url.replace(/^\/api/, '');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles unauthorized status (401) by clearing credentials and network disconnection errors via toast alerts.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is an HTTP 401 Unauthorized response
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('crm-token');
      sessionStorage.removeItem('crm-token');
      
      // Avoid redirect loops if already on authentication pages
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    } else if (!error.response) {
      // Network failure or server down
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const detailMsg = isLocalhost
        ? 'Cannot connect to server. Ensure backend process is running on port 5000.'
        : 'Network error. Please check your internet connection or backend server.';
        
      toast.error(detailMsg, { id: 'network-error' });
    }

    return Promise.reject(error);
  }
);

export default api;
