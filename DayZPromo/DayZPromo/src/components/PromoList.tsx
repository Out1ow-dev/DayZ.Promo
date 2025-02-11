import React from 'react';
import { 
  DetailsList, 
  IColumn, 
  SelectionMode, 
  Stack, 
  Text, 
  Image, 
  Dialog, 
  DialogType,
  DefaultButton,
  PrimaryButton,
  TextField,
  DatePicker,
  MessageBar,
  MessageBarType
} from '@fluentui/react';
import { useTheme } from '../contexts/ThemeContext';
import { Client, PromoCode, PostImageDto } from '../api/Api';

const apiClient = new Client('/api');

interface PromoListProps {
  promos: PromoCode[];
  onRefresh: () => void;
}

export const PromoList: React.FC<PromoListProps> = ({ promos, onRefresh }) => {
  // ... остальной код ...

  const handleUpdate = async (updatedPromo: PostImageDto) => {
    if (!editingPromo) return;

    setLoading(true);
    try {
      await apiClient.updatePromo(editingPromo.id, updatedPromo);
      setIsEditDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Failed to update promo:', error);
      setError('Не удалось обновить промокод');
    } finally {
      setLoading(false);
    }
  };

  // ... остальной код ...

  return (
    // ... остальной JSX ...
    <DatePicker
      label="Дата окончания"
      value={editingPromo ? new Date(editingPromo.expirationDate) : undefined}
      onSelectDate={(date) => 
        setEditingPromo(prev => prev ? {
          ...prev,
          expirationDate: date ? date.toISOString() : new Date().toISOString()
        } : null)
      }
      minDate={new Date()}
    />
    // ... остальной JSX ...
  );
}; 