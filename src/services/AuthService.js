import $api from '../http/api';

// Register user
const register = async (userData) => {
  const response = await $api.post('/auth/register', userData);
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await $api.post('/auth/login', userData);
  return response.data;
};

// Logout user
const logout = async () => {
  try {
    // Call backend logout endpoint if exists
    // await $api.post('/auth/logout');
    
    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local storage even if API call fails
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    return false;
  }
};

// Refresh token
const refreshToken = async () => {
  const response = await $api.post('/auth/refresh');
  return response.data;
};

// Get current user
const getCurrentUser = async () => {
  const response = await $api.get('/auth/me');
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  refreshToken,
  getCurrentUser,
};

export default authService;