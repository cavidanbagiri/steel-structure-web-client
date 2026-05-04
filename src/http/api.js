import axios from 'axios';

export const API_URL = 'http://localhost:8000/api';

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies (refresh_token)
  headers: {
    'Content-Type': 'application/json',
  },
});

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling token refresh
$api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 error and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return $api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/auth?mode=login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default $api;