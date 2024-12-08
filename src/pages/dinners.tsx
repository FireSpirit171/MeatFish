import React, { useEffect, useState } from 'react';
import ApiClient from '../api/APIClient';
import { Dinner } from '@/api/Types';
import { useRouter } from 'next/router';

const DinnersPage = () => {
  const [dinners, setDinners] = useState<Dinner[]>([]);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchDinners = async () => {
      try {
        const response = await ApiClient.getDinners({ date_from: dateFrom, date_to: dateTo, status });
        const data = await response.json() as Dinner[];
        console.log(data)
        setDinners(data);
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      }
    };

    fetchDinners();
  }, [dateFrom, dateTo, status]);

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

  const handleRowClick = (id: number) => {
    router.push(`/dinners/${id}`);
  };

  return (
    <div className="dinners-page">
      <h1>Ваши заказы</h1>
      <div className="filters">
        <label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>
        <label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
        <label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Все</option>
            <option value="f">В работе</option>
            <option value="c">Завершена</option>
            <option value="r">Отклонена</option>
          </select>
        </label>
      </div>
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
            <tr
              key={dinner.id}
              onClick={() => handleRowClick(dinner.id)}
            >
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