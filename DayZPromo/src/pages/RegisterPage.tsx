import React from 'react';
import { 
  Stack,
  Text,
  Link,
  IStackStyles
} from '@fluentui/react';
import { RegisterForm } from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const containerStyles: IStackStyles = {
  root: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    width: '100%'
  }
};

const cardStyles: IStackStyles = {
  root: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
  }
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Редирект если пользователь уже авторизован
  React.useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/');
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <Stack 
      horizontalAlign="center" 
      verticalAlign="center" 
      styles={containerStyles}
    >
      <Stack styles={cardStyles} tokens={{ childrenGap: 16 }}>
        <Text variant="xxLarge" block styles={{ root: { textAlign: 'center' } }}>
          Регистрация
        </Text>
        <RegisterForm />
        <Link 
          onClick={() => navigate('/login')}
          styles={{ root: { textAlign: 'center' } }}
        >
          Уже есть аккаунт? Войдите
        </Link>
      </Stack>
    </Stack>
  );
}; 