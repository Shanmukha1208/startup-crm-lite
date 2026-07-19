import api from './api';

/**
 * Authentication & User Profile API Service handling user accounts, profile, and session management.
 */

/**
 * Register a new user account.
 *
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} API response data containing user and JWT token
 */
export const register = async (name, email, password) => {
  const response = await api.post('/api/auth/register', {
    name,
    email,
    password,
  });
  return response.data;
};

/**
 * Log in an existing user.
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} API response data containing user and JWT token
 */
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  });
  return response.data;
};

/**
 * Log out the current user session.
 * Removes stored authentication tokens from both localStorage and sessionStorage.
 */
export const logout = () => {
  localStorage.removeItem('crm-token');
  sessionStorage.removeItem('crm-token');
};

/**
 * Get authenticated user profile details.
 *
 * @returns {Promise<Object>} API response data containing user profile
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/api/profile');
    return response.data;
  } catch (error) {
    // Fallback to /api/auth/me if needed
    const response = await api.get('/api/auth/me');
    return response.data;
  }
};

/**
 * Update authenticated user profile details (name, username, email, avatar).
 *
 * @param {Object} data - Profile fields to update (name, username, email, avatar)
 * @returns {Promise<Object>} API response data containing updated user profile
 */
export const updateProfile = async (data) => {
  const response = await api.put('/api/profile', data);
  return response.data;
};

/**
 * Change authenticated user's password securely.
 *
 * @param {Object} data - Password object containing { currentPassword, newPassword, confirmPassword }
 * @returns {Promise<Object>} API response status and message
 */
export const changePassword = async (data) => {
  const response = await api.put('/api/profile/change-password', data);
  return response.data;
};

export default {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
};
