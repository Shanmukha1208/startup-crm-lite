import React, { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(undefined);

/**
 * Provider component that manages the application's dark mode state.
 * @component
 */
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('crm_theme');
    return saved ? JSON.parse(saved) : false;
  });

  // Apply theme to document on mount and when state changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('crm_theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  /**
   * Toggles the application between light and dark modes.
   */
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to consume the ThemeContext.
 * @returns {Object} Context payload containing isDarkMode state and toggleTheme function
 * @throws {Error} If called outside of a ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
