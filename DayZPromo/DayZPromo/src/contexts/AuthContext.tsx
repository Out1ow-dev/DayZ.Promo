import React, { createContext, useContext, useState } from 'react';
import { Client } from '../api/Api';

// Удалим неиспользуемые импорты и константы

interface AuthContextType {
  user: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const apiClient = new Client('/api');

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.login({ username, password });
      setUser(response.username);
    } catch (error) {
      throw error;
    }
  };

  // ... остальной код ...
}; 