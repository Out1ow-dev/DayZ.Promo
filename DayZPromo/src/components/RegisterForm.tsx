import React, { useState } from 'react';
import { 
  Stack,
  TextField,
  PrimaryButton,
  MessageBar,
  MessageBarType,
  Text
} from '@fluentui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(username, password);
      navigate('/'); // Редирект на главную после успешной регистрации
    } catch (err) {
      setError('Ошибка при регистрации. Попробуйте другое имя пользователя.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack tokens={{ childrenGap: 15 }} styles={{ root: { maxWidth: 300 } }}>
      <Text variant="xLarge">Регистрация</Text>
      {error && (
        <MessageBar messageBarType={MessageBarType.error}>
          {error}
        </MessageBar>
      )}
      <form onSubmit={handleSubmit}>
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="Имя пользователя"
            value={username}
            onChange={(_, newValue) => setUsername(newValue || '')}
            required
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(_, newValue) => setPassword(newValue || '')}
            required
          />
          <PrimaryButton type="submit" disabled={isLoading}>Зарегистрироваться</PrimaryButton>
        </Stack>
      </form>
    </Stack>
  );
}; 