import React, { useState } from 'react';
import { 
  Stack,
  TextField,
  PrimaryButton,
  MessageBar,
  MessageBarType,
  IStackTokens
} from '@fluentui/react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const stackTokens: IStackTokens = { childrenGap: 15 };

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Неверное имя пользователя или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack tokens={stackTokens}>
        {error && (
          <MessageBar messageBarType={MessageBarType.error}>
            {error}
          </MessageBar>
        )}
        
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
          canRevealPassword
        />
        
        <PrimaryButton 
          type="submit" 
          text="Войти"
          disabled={isLoading}
        />
      </Stack>
    </form>
  );
}; 