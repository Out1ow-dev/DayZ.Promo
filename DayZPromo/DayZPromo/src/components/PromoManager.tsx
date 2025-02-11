import React, { useState } from 'react';
import { DatePicker } from '@fluentui/react';

export const PromoManager: React.FC = () => {
  const [date, setDate] = useState(new Date());

  return (
    <DatePicker
      label="Дата окончания"
      value={date}
      onSelectDate={setDate}
      minDate={new Date()}
      isRequired={true}
    />
  );
}; 