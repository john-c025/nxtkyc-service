'use client';

import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

// Pastel Yellow Color Palette inspired by the logo
export const colorPalette = {
  primary: {
    50: '#fefdf8',    // Very light cream
    100: '#fef3c7',   // Light pastel yellow
    200: '#fde68a',   // Soft yellow
    300: '#fcd34d',   // Medium yellow
    400: '#fbbf24',   // Vibrant yellow
    500: '#f59e0b',   // Main yellow (from logo)
    600: '#d97706',   // Darker yellow
    700: '#b45309',   // Deep yellow
    800: '#92400e',   // Brown yellow
    900: '#78350f',   // Dark brown
  },
  secondary: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fefce8',
    500: '#eab308',
    600: '#ca8a04',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  }
};

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode for yellow theme
  const [currentTheme, setCurrentTheme] = useState('yellow');

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (theme) => {
    setCurrentTheme(theme);
  };

  const themeValues = {
    isDarkMode,
    currentTheme,
    colorPalette,
    toggleTheme,
    setTheme,
    colors: colorPalette
  };

  return (
    <ThemeContext.Provider value={themeValues}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
