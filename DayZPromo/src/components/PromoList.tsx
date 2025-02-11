import React from 'react';
import { 
  DetailsList, 
  IColumn, 
  SelectionMode, 
  Stack, 
  Image,
  Dialog, 
  DialogType,
  DefaultButton,
  PrimaryButton,
  TextField,
  DatePicker,
  MessageBar,
  MessageBarType,
  ImageFit
} from '@fluentui/react';
import { useTheme } from '../contexts/ThemeContext';
import { Client, PostImageDto } from '../api/Api';
import { PromoCode } from '../types/PromoCode';

const apiClient = new Client();

export const PromoList: React.FC<{ promos: PromoCode[]; onRefresh: () => void }> = ({ promos, onRefresh }) => {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = React.useState<string | undefined>(undefined);
  const [editingPromo, setEditingPromo] = React.useState<PromoCode | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  console.log('Received promos:', promos); // Для отладки

  const formatDate = (dateString: string) => {
    try {
        // Предполагаем, что дата приходит в формате "YYYY-MM-DDTHH:mm:ss"
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error('Invalid date:', dateString);
            return dateString; // Возвращаем исходную строку, если не удалось распарсить
        }
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // Возвращаем исходную строку в случае ошибки
    }
  };

  const handleEdit = async (promo: PromoCode) => {
    setEditingPromo(promo);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот промокод?')) {
      return;
    }

    setLoading(true);
    try {
      await apiClient.deletePromo(id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete promo:', error);
      setError('Не удалось удалить промокод');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedPromo: PostImageDto) => {
    if (!editingPromo) return;

    setLoading(true);
    try {
        // Создаем временную дату для форматирования
        const tempDate = new Date(editingPromo.expirationDate);
        tempDate.setHours(23, 59, 59, 999);

        // Создаем объект с правильными типами
        const updateData: PostImageDto = {
            name: updatedPromo.name,
            expirationDate: tempDate.toISOString() // Сразу преобразуем в строку
        };

        await apiClient.updatePromo(editingPromo.id, updateData);
        setIsEditDialogOpen(false);
        onRefresh();
    } catch (error) {
        console.error('Failed to update promo:', error);
        setError('Не удалось обновить промокод');
    } finally {
        setLoading(false);
    }
  };

  const columns: IColumn[] = [
    {
      key: 'name',
      name: 'Название',
      fieldName: 'name',
      minWidth: 100,
      maxWidth: 200,
    },
    {
      key: 'promo',
      name: 'Промокод',
      fieldName: 'promo',
      minWidth: 100,
      maxWidth: 150,
    },
    {
      key: 'expirationDate',
      name: 'Действителен до',
      fieldName: 'expirationDate',
      minWidth: 100,
      maxWidth: 150,
      onRender: (item: PromoCode) => formatDate(item.expirationDate)
    },
    {
      key: 'image',
      name: 'Изображение',
      minWidth: 100,
      maxWidth: 150,
      onRender: (item: PromoCode) => {
        const imageUrl = item.finalImagePath 
          ? `/api/${item.finalImagePath.replace(/^\/+/, '')}`
          : undefined;
        
        return (
          <Stack>
            <DefaultButton
              text="Просмотреть"
              onClick={() => imageUrl && setSelectedImage(imageUrl)}
              disabled={!imageUrl}
            />
            {selectedImage === imageUrl && imageUrl && (
              <Image
                src={imageUrl}
                width={200}
                height="auto"
                imageFit={ImageFit.contain}
                styles={{ root: { margin: '10px 0' } }}
              />
            )}
          </Stack>
        );
      },
    },
    {
      key: 'actions',
      name: 'Действия',
      minWidth: 100,
      maxWidth: 150,
      onRender: (item: PromoCode) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <DefaultButton
            iconProps={{ iconName: 'Edit' }}
            onClick={() => handleEdit(item)}
          />
          <DefaultButton
            iconProps={{ iconName: 'Delete' }}
            onClick={() => handleDelete(item.id)}
          />
        </Stack>
      ),
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 20 }}>
      {error && (
        <MessageBar messageBarType={MessageBarType.error} onDismiss={() => setError('')}>
          {error}
        </MessageBar>
      )}

      <DetailsList
        items={promos}
        columns={columns}
        selectionMode={SelectionMode.none}
        styles={{
          root: {
            backgroundColor: theme.palette.white,
            borderRadius: '8px',
            padding: '20px',
            boxShadow: theme.effects.elevation4
          }
        }}
      />

      <Dialog
        hidden={!isEditDialogOpen}
        onDismiss={() => setIsEditDialogOpen(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Редактировать промокод'
        }}
      >
        {editingPromo && (
          <Stack tokens={{ childrenGap: 15 }}>
            <TextField
              label="Название"
              defaultValue={editingPromo.name}
              onChange={(_, newValue) => {
                if (editingPromo) {
                  setEditingPromo({
                    ...editingPromo,
                    name: newValue || ''
                  });
                }
              }}
            />
            <DatePicker
              label="Дата окончания"
              value={new Date(editingPromo.expirationDate)}
              onSelectDate={(date) => {
                if (date && editingPromo) {
                  const newDate = new Date(date);
                  newDate.setHours(23, 59, 59, 999);
                  setEditingPromo({
                    ...editingPromo,
                    expirationDate: newDate.toISOString()
                  });
                }
              }}
              minDate={new Date()}
            />
            <Stack horizontal tokens={{ childrenGap: 10 }} horizontalAlign="end">
              <DefaultButton
                text="Отмена"
                onClick={() => setIsEditDialogOpen(false)}
              />
              <PrimaryButton
                text="Сохранить"
                onClick={() => {
                  if (editingPromo) {
                    handleUpdate({
                      name: editingPromo.name,
                      expirationDate: editingPromo.expirationDate
                    });
                  }
                }}
                disabled={loading}
              />
            </Stack>
          </Stack>
        )}
      </Dialog>

      <Dialog
        hidden={!selectedImage}
        onDismiss={() => setSelectedImage(undefined)}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Просмотр изображения'
        }}
        modalProps={{
          isBlocking: false,
          styles: { main: { maxWidth: '80%!important' } }
        }}
      >
        {selectedImage && (
          <Image
            src={selectedImage}
            width="100%"
            height="auto"
            key={selectedImage}
          />
        )}
      </Dialog>
    </Stack>
  );
}; 