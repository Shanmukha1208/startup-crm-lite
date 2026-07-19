import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(undefined);

/**
 * AuthProvider Component
 * Manages global authentication state, token persistence, user profile, and login/logout lifecycles.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem('crm-token') || sessionStorage.getItem('crm-token') || null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount if JWT token exists in localStorage or sessionStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken =
        localStorage.getItem('crm-token') || sessionStorage.getItem('crm-token');
      if (storedToken) {
        try {
          const res = await authService.getProfile();
          if (res && res.user) {
            setUser(res.user);
            setToken(storedToken);
          } else {
            throw new Error('User profile response missing');
          }
        } catch (error) {
          console.error('Failed to restore user session:', error);
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Log in user with credentials and optional "Remember Me" persistence.
   *
   * @param {string} email
   * @param {string} password
   * @param {boolean} rememberMe - If true, persists session in localStorage; otherwise in sessionStorage.
   */
  const login = async (email, password, rememberMe = true) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res && res.token) {
        if (rememberMe) {
          localStorage.setItem('crm-token', res.token);
          sessionStorage.removeItem('crm-token');
        } else {
          sessionStorage.setItem('crm-token', res.token);
          localStorage.removeItem('crm-token');
        }
        setToken(res.token);
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register a new user account.
   *
   * @param {string} name
   * @param {string} email
   * @param {string} password
   */
  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.register(name, email, password);
      if (res && res.token) {
        localStorage.setItem('crm-token', res.token);
        setToken(res.token);
        setUser(res.user);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update current authenticated user profile details.
   *
   * @param {Object} data - Profile fields to update (name, username, email, avatar)
   */
  const updateUserProfile = async (data) => {
    const res = await authService.updateProfile(data);
    if (res && res.user) {
      setUser(res.user);
    }
    return res;
  };

  /**
   * Change current user's password.
   *
   * @param {Object} data - { currentPassword, newPassword, confirmPassword }
   */
  const changePassword = async (data) => {
    return await authService.changePassword(data);
  };

  /**
   * Refresh current user profile details from backend.
   */
  const refreshProfile = async () => {
    try {
      const res = await authService.getProfile();
      if (res && res.user) {
        setUser(res.user);
      }
      return res;
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  /**
   * Log out current user and clear local & session state.
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        setUser,
        updateUserProfile,
        changePassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to consume AuthContext.
 *
 * @returns {Object} Authentication state and handler functions
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
