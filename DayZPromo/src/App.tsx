import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { Stack, CommandBar, ICommandBarItemProps } from '@fluentui/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ImageCreatePage } from './pages/ImageCreatePage';
import { useNavigate } from 'react-router-dom';

initializeIcons();

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkTheme, toggleTheme, theme } = useTheme();
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const commandItems: ICommandBarItemProps[] = auth.isAuthenticated ? [
    {
      key: 'newItem',
      text: 'Создать промо',
      iconProps: { iconName: 'Add' },
      onClick: () => {
        navigate('/');
        return false;
      }
    }
  ] : [];

  const farItems: ICommandBarItemProps[] = [
    {
      key: 'theme',
      text: isDarkTheme ? 'Светлая тема' : 'Темная тема',
      iconProps: { iconName: isDarkTheme ? 'Sunny' : 'ClearNight' },
      onClick: toggleTheme
    },
    ...(auth.isAuthenticated ? [
      {
        key: 'userInfo',
        text: auth.username || undefined,
        iconProps: { iconName: 'Contact' }
      },
      {
        key: 'logout',
        text: 'Выйти',
        iconProps: { iconName: 'SignOut' },
        onClick: () => {
          logout();
          navigate('/login');
        }
      }
    ] : [])
  ];

  return (
    <Stack styles={{
      root: {
        minHeight: '100vh',
        backgroundColor: theme.palette.neutralLighter,
        transition: 'all 0.2s ease'
      }
    }}>
      <CommandBar
        items={commandItems}
        farItems={farItems}
        styles={{
          root: {
            backgroundColor: theme.palette.white,
            borderBottom: `1px solid ${theme.palette.neutralLight}`,
            padding: '0 20px'
          }
        }}
      />
      <Stack styles={{
        root: {
          padding: '20px',
          flex: 1
        }
      }}>
        {children}
      </Stack>
    </Stack>
  );
};

const AppContent: React.FC = () => {
  const { auth } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        auth.isAuthenticated ? <Navigate to="/" /> : <LoginPage />
      } />
      <Route path="/register" element={
        auth.isAuthenticated ? <Navigate to="/" /> : <RegisterPage />
      } />
      <Route path="/" element={
        auth.isAuthenticated ? (
          <Layout>
            <ImageCreatePage />
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
