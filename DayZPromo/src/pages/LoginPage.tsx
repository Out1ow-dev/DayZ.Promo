import React from 'react';
import { 
  Stack,
  Text,
  Link,
  IStackStyles
} from '@fluentui/react';
import { LoginForm } from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { isDarkTheme, theme } = useTheme();

  // Редирект если пользователь уже авторизован
  React.useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]);

  const containerStyles: IStackStyles = {
    root: {
      minHeight: '100vh',
      width: '100%',
      padding: '20px',
      backgroundColor: theme.palette.white,
      color: theme.palette.neutralPrimary
    }
  };

  const cardStyles: IStackStyles = {
    root: {
      backgroundColor: isDarkTheme ? theme.palette.neutralLighter : theme.palette.white,
      padding: 40,
      borderRadius: 8,
      boxShadow: isDarkTheme 
        ? '0 4px 12px rgba(0, 0, 0, 0.4)'
        : '0 2px 8px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '500px',
      margin: '0 auto',
      transition: 'all 0.2s ease'
    }
  };

  return (
    <Stack 
      horizontalAlign="center" 
      verticalAlign="center" 
      styles={containerStyles}
    >
      <Stack styles={cardStyles} tokens={{ childrenGap: 20 }}>
        <Text 
          variant="xxLarge" 
          block 
          styles={{ 
            root: { 
              textAlign: 'center',
              color: theme.palette.neutralPrimary,
              fontWeight: 600
            }
          }}
        >
          Вход
        </Text>
        <LoginForm />
        <Link 
          onClick={() => navigate('/register')}
          styles={{ 
            root: { 
              textAlign: 'center',
              color: theme.palette.themePrimary
            }
          }}
        >
          Нет аккаунта? Зарегистрируйтесь
        </Link>
      </Stack>
    </Stack>
  );
}; 