import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const isPlaceholderApiUrl = configuredApiUrl?.includes('your-backend.onrender.com');
const API_BASE_URL = (!configuredApiUrl || isPlaceholderApiUrl)
  ? (import.meta.env.DEV ? 'http://localhost:8080/api' : '')
  : configuredApiUrl;

if (import.meta.env.PROD && (!configuredApiUrl || isPlaceholderApiUrl)) {
  console.error('Invalid VITE_API_URL in production. Set a real backend URL in Vercel environment variables.');
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on auth endpoints (login/register should show their own errors)
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
