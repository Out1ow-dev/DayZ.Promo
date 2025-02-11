import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as FluentThemeProvider, createTheme } from '@fluentui/react';

type ThemeContextType = {
  isDarkTheme: boolean;
  toggleTheme: () => void;
  theme: any;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightTheme = createTheme({
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#f3f9fd',
    themeLighter: '#d0e7f8',
    themeLight: '#a7d0f2',
    themeTertiary: '#4a90e2',
    themeSecondary: '#0078d4',
    themeDarkAlt: '#106ebe',
    themeDark: '#005a9e',
    themeDarker: '#004578',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  }
});

const darkTheme = createTheme({
  palette: {
    themePrimary: '#2b88d8',
    themeLighterAlt: '#f5f9fd',
    themeLighter: '#e5f1fb',
    themeLight: '#cce4f6',
    themeTertiary: '#98c7ed',
    themeSecondary: '#66aae3',
    themeDarkAlt: '#2679c2',
    themeDark: '#2066a3',
    themeDarker: '#174c78',
    neutralLighterAlt: '#2d2d2d',
    neutralLighter: '#333333',
    neutralLight: '#414141',
    neutralQuaternaryAlt: '#4a4a4a',
    neutralQuaternary: '#515151',
    neutralTertiaryAlt: '#6f6f6f',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#1f1f1f',
  }
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const theme = isDarkTheme ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  };

  useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, theme }}>
      <FluentThemeProvider theme={theme}>
        <div style={{ 
          backgroundColor: theme.palette.white,
          minHeight: '100vh',
          width: '100%',
          transition: 'background-color 0.2s ease'
        }}>
          {children}
        </div>
      </FluentThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 