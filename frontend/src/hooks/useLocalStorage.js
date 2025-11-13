import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with automatic sync
 * @param {string} key - localStorage key
 * @param {*} defaultValue - default value if key doesn't exist
 * @returns {[*, Function]} - [value, setValue]
 */
export const useLocalStorage = (key, defaultValue) => {
  // Initialize state with value from localStorage or default
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Save to localStorage whenever value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
};
