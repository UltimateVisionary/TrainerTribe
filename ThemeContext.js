import React, { createContext, useContext, useState, useMemo } from 'react';

export const lightTheme = {
  mode: 'light',
  background: '#ffffff',
  card: '#f8f9fa',
  text: '#1a1a1a',
  textSecondary: '#6e727c',
  border: '#dfe0e2',
  primary: '#3464db',
  primaryLight: 'rgba(52, 100, 219, 0.1)',
  primaryDark: '#2850b0',
  grey: '#6e727c',
  greyLight: '#8b8e96',
  greyDark: '#4a4d54',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FFA726',
  white: '#fff',
  gradients: {
    primary: ['#3464db', '#2850b0'],
    grey: ['#6e727c', '#4a4d54']
  },
};

export const darkTheme = {
  mode: 'dark',
  background: '#181a20',
  card: '#23262f',
  text: '#f4f4f4',
  textSecondary: '#b0b3b8',
  border: '#23262f',
  primary: '#60A5FA',
  primaryLight: 'rgba(96, 165, 250, 0.15)',
  primaryDark: '#4169E1',
  grey: '#b0b3b8',
  greyLight: '#6e727c',
  greyDark: '#23262f',
  error: '#ff6b6b',
  success: '#22c55e',
  warning: '#fbbf24',
  white: '#23262f',
  gradients: {
    primary: ['#4169E1', '#60A5FA'],
    grey: ['#23262f', '#181a20']
  },
};

const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev.mode === 'light' ? darkTheme : lightTheme));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
