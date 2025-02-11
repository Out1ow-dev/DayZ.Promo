import React from 'react';
import { ICommandBarItemProps } from '@fluentui/react';

// ... остальные импорты ...

export const App: React.FC = () => {
  // ... остальной код ...

  const items: ICommandBarItemProps[] = [
    {
      key: 'newItem',
      text: 'Создать промокод',
      iconProps: { iconName: 'Add' },
      onClick: async () => {
        navigate('/create');
      }
    }
  ];

  const farItems: ICommandBarItemProps[] = [
    user ? {
      key: 'userName',
      text: user,
      iconProps: { iconName: 'Contact' }
    } : {
      key: 'login',
      text: 'Войти',
      iconProps: { iconName: 'SignOut' },
      onClick: () => navigate('/login')
    }
  ];

  // ... остальной код ...
}; 