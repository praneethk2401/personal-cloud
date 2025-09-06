import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const lightColors = {
    bg: '#fefefe',
    headline: '#2d334a',
    paragraph: '#525252',
    button: '#f25f4c',
    buttonText: '#fffffe',
    card: '#ffffff',
    secondary: '#ff8906',
    accent: '#e53e3e'
  };

  const darkColors = {
    bg: '#16161a',
    headline: '#fffffe',
    paragraph: '#94a1b2',
    button: '#7f5af0',
    buttonText: '#fffffe',
    card: '#242629',
    secondary: '#ff8906',
    accent: '#f56565'
  };

  const colors = isDarkMode ? darkColors : lightColors;

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};