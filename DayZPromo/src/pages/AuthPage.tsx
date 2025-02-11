import React from 'react';
import { 
  Stack,
  Text,
  DefaultButton,
  IStackTokens,
  IStackStyles
} from '@fluentui/react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

const stackTokens: IStackTokens = { 
  childrenGap: 20,
  padding: 20
};

const containerStyles: IStackStyles = {
  root: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  }
};

const cardStyles: IStackStyles = {
  root: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: 400,
    width: '100%'
  }
};

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(true);

  return (
    <Stack 
      horizontalAlign="center" 
      verticalAlign="center" 
      styles={containerStyles}
      tokens={stackTokens}
    >
      <Stack styles={cardStyles} tokens={{ childrenGap: 16 }}>
        <Text variant="xxLarge" block>
          {isLogin ? 'Вход' : 'Регистрация'}
        </Text>
        
        {isLogin ? <LoginForm /> : <RegisterForm />}
        
        <DefaultButton 
          text={isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт?'} 
          onClick={() => setIsLogin(!isLogin)}
        />
      </Stack>
    </Stack>
  );
}; 