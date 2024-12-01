import React, { useEffect, useState } from 'react';
import ApiClient from '../api/APIClient';
import { Dinner } from '@/api/Types';

const DinnersPage = () => {
  const [dinners, setDinners] = useState<Dinner[]>([]);

  useEffect(() => {
    const fetchDinners = async () => {
      try {
        const response = await ApiClient.getDinners();
        const data = await response.json();
        setDinners(data);
      } catch (error) {
        console.error('Ошибка при загрузке заявок:', error);
      }
    };

    fetchDinners();
  }, []);

  const formatDate = (dateString: string | null) =>
    dateString ? new Date(dateString).toLocaleString() : '—';

  const getStatusText = (status: string) => {
    switch (status) {
      case 'f':
        return 'В работе';
      case 'c':
        return 'Завершена';
      case 'r':
        return 'Отклонена';
      default:
        return 'Неизвестен';
    }
  };

  return (
    <div className="dinners-page">
      <h1>Ваши заказы</h1>
      <table className="dinners-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Дата оформления</th>
            <th>Дата завершения</th>
          </tr>
        </thead>
        <tbody>
          {dinners.map((dinner: Dinner) => (
            <tr key={dinner.id}>
              <td>{dinner.id}</td>
              <td>{getStatusText(dinner.status)}</td>
              <td>{formatDate(dinner.created_at)}</td>
              <td>{formatDate(dinner.formed_at)}</td>
              <td>{formatDate(dinner.completed_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DinnersPage;
