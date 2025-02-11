import React, { useState } from 'react';
import { 
  Stack,
  TextField,
  PrimaryButton,
  DatePicker,
  MessageBar,
  MessageBarType,
  Text
} from '@fluentui/react';
import { Client } from '../api/Api';

// Создаем клиент без параметров
const apiClient = new Client();

export const PromoManager: React.FC = () => {
  const [promoName, setPromoName] = useState('');
  const [expirationDate, setExpirationDate] = useState<Date | undefined>();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expirationDate || !promoName) return;

    setLoading(true);
    try {
      const date = new Date(expirationDate);
      date.setHours(23, 59, 59, 999);

      await apiClient.generatePromoPOST({
        name: promoName,
        expirationDate: date.toISOString()
      });

      setSuccess('Промокод успешно создан!');
      setPromoName('');
      setExpirationDate(undefined);
    } catch (error) {
      console.error('Failed to create promo:', error);
      setError('Не удалось создать промокод');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack tokens={{ childrenGap: 15 }} styles={{ root: { maxWidth: 400 } }}>
      <Text variant="xLarge">Создать промо</Text>
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
            value={promoName}
            onChange={(_, newValue) => setPromoName(newValue || '')}
            required
          />
          <DatePicker
            label="Дата окончания"
            value={expirationDate}
            onSelectDate={(date: Date | null | undefined) => setExpirationDate(date || undefined)}
            minDate={new Date()}
            isRequired={true}
          />
          <PrimaryButton type="submit" disabled={loading}>Создать промо</PrimaryButton>
        </Stack>
      </form>
    </Stack>
  );
}; 