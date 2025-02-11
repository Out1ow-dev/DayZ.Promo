import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContextType, AuthState } from '../types/auth';
import { Client as BaseClient } from '../api/Api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Расширяем базовый класс Client
class Client extends BaseClient {
    setTransformOptions(transform: (options: RequestInit) => Promise<RequestInit>) {
        this.transformOptions = transform;
    }
}

// Создаем экземпляр расширенного класса
const apiClient = new Client();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    username: null,
  });

  // Проверяем состояние авторизации при загрузке и после каждого обновления страницы
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await apiClient.checkAuth();
        if (response.isAuthenticated && response.username) {
          setAuth({
            isAuthenticated: true,
            username: response.username
          });
        } else {
          setAuth({
            isAuthenticated: false,
            username: null
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuth({
          isAuthenticated: false,
          username: null
        });
      }
    };

    checkAuthStatus();
  }, []);

  // Настраиваем опции запросов для отправки куки
  apiClient.setTransformOptions((options: RequestInit) => {
    return Promise.resolve({
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      }
    });
  });

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.login({ username, password });
      if (response && response.message === "User logged in successfully!") {
        setAuth({ 
          isAuthenticated: true, 
          username: response.username 
        });
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Ошибка входа');
    }
  };

  const register = async (username: string, password: string) => {
    try {
      await apiClient.register({ username, password });
      await login(username, password);
    } catch (error) {
      throw new Error('Ошибка регистрации');
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setAuth({ isAuthenticated: false, username: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}; 