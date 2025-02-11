import React, { useEffect, useCallback } from 'react';
import { 
  Stack, 
  Text, 
  PrimaryButton, 
  DatePicker, 
  TextField,
  MessageBar,
  MessageBarType,
  IStackStyles,
  DefaultButton,
  Spinner,
  SpinnerSize
} from '@fluentui/react';
import { useTheme } from '../contexts/ThemeContext';
import { Client } from '../api/Api';
import { PromoList } from '../components/PromoList';
import type { PromoCode } from '../types/PromoCode';

// Будет использовать текущий хост
const apiClient = new Client();

export const ImageCreatePage: React.FC = () => {
  const { theme } = useTheme();
  const [name, setName] = React.useState('');
  const [date, setDate] = React.useState<Date | undefined>();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [promos, setPromos] = React.useState<PromoCode[]>([]);

  const containerStyles: IStackStyles = {
    root: {
      backgroundColor: theme.palette.white,
      padding: '30px',
      borderRadius: '8px',
      boxShadow: theme.effects.elevation4
    }
  };

  const loadPromos = useCallback(async () => {
    try {
      setLoading(true);
      const apiPromos = await apiClient.getPromocodesList();
      // Преобразуем ApiPromoCode в PromoCode
      const mappedPromos: PromoCode[] = apiPromos.map(promo => ({
        ...promo,
        isActive: new Date(promo.expirationDate) > new Date()
      }));
      setPromos(mappedPromos);
    } catch (error) {
      console.error('Failed to load promos:', error);
      setError('Не удалось загрузить список промокодов');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPromos();
  }, []); // Запускаем только при монтировании компонента

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !name) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
        // Устанавливаем время на конец дня (23:59:59)
        const expirationDate = new Date(date);
        expirationDate.setHours(23, 59, 59, 999);

        // Форматируем дату в ISO строку
        const formattedDate = expirationDate.toISOString();

        const result = await apiClient.generatePromoPOST({
            name: name,
            expirationDate: formattedDate // Отправляем строку вместо объекта Date
        });
        
        console.log('Created promo:', result);
        setSuccess(`Промокод успешно создан! Код: ${result.promo}`);
        setName('');
        setDate(undefined);
        loadPromos();
    } catch (error) {
        console.error('Failed to create promo:', error);
        if (error instanceof Error) {
            if (error.message.includes('Access Denied')) {
                setError('Доступ запрещен. У вас нет прав для создания промокодов.');
            } else if (error.message.includes('Unauthorized')) {
                setError('Необходима авторизация');
            } else if (error.message.includes('Invalid request data')) {
                setError('Неверные данные запроса. Проверьте введенные значения.');
            } else {
                setError(`Не удалось создать промокод: ${error.message}`);
            }
        } else {
            setError('Не удалось создать промокод');
        }
    } finally {
        setLoading(false);
    }
  };

  const handleDateChange = (date: Date | null | undefined) => {
    setDate(date || undefined);
  };

  const handleRefresh = () => {
    loadPromos();
  };

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      <Stack styles={containerStyles} tokens={{ childrenGap: 20 }}>
        <Text variant="xLarge" styles={{ root: { color: theme.palette.neutralPrimary } }}>
          Создать новое промо
        </Text>
        
        {error && (
          <MessageBar messageBarType={MessageBarType.error}>
            {error}
          </MessageBar>
        )}
        
        {success && (
          <MessageBar messageBarType={MessageBarType.success}>
            {success}
          </MessageBar>
        )}

        <form onSubmit={handleSubmit}>
          <Stack tokens={{ childrenGap: 15 }}>
            <TextField
              label="Название промо"
              value={name}
              onChange={(_, newValue) => setName(newValue || '')}
              required
              disabled={loading}
            />
            
            <DatePicker
              label="Дата окончания"
              value={date}
              onSelectDate={handleDateChange}
              minDate={new Date()}
              isRequired
              disabled={loading}
            />
            
            <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="end">
              <DefaultButton 
                text="Отмена" 
                onClick={() => {
                  setName('');
                  setDate(undefined);
                }}
                disabled={loading}
              />
              <PrimaryButton 
                type="submit" 
                text="Создать"
                disabled={loading}
              />
            </Stack>
          </Stack>
        </form>
      </Stack>

      {loading && <Spinner size={SpinnerSize.large} />}

      <PromoList 
        promos={promos}
        onRefresh={handleRefresh} 
      />
    </Stack>
  );
}; 