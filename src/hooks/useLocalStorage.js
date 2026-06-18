import { useState, useEffect } from 'react';

/**
 * A custom hook that synchronizes a state variable with localStorage.
 * Identical API to useState: returns [storedValue, setValue].
 * Handles JSON parse errors and graceful fallback when localStorage is unavailable.
 *
 * @param {string} key - The unique key used to store the data in localStorage
 * @param {any} initialValue - The fallback value if no data exists in localStorage
 * @returns {[any, Function]} An array containing the current stored value and a setter function
 */
export default function useLocalStorage(key, initialValue) {
  // Initialize state by checking localStorage first
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Check if window exists to prevent SSR errors (if the app ever moves to Next.js)
      if (typeof window === 'undefined') {
        return initialValue;
      }

      // Retrieve item from local storage
      const item = window.localStorage.getItem(key);
      
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error (e.g. invalid JSON or privacy settings block localStorage), return initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Keep localStorage updated whenever storedValue changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // Save state to local storage
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      // Gracefully handle quota exceeded or unavailable local storage scenarios
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
