import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ApiClient from '../api/APIClient';
import DinnerCard from '../components/DinnerCard';
import { Dinner } from '@/api/Types';

const DinnersPage = () => {
  const [dinners, setDinners] = useState<Dinner[]>([]);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const router = useRouter();

  const handleRowClick = (id: number) => {
    router.push(`/dinners/${id}`);
  };

  useEffect(() => {
    const fetchDinners = async () => {
      try {
        const response = await ApiClient.getDinners({ date_from: dateFrom, date_to: dateTo, status });
        const data = (await response.json()) as Dinner[];
        setDinners(data);
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      }
    };

    fetchDinners();
  }, [dateFrom, dateTo, status]);

  return (
    <div className="dinners-page">
      <h1>Ваши заказы</h1>
      <div className="filters">
        <label>
          Дата от:
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>
        <label>
          Дата до:
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
        <label>
          Статус:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Все</option>
            <option value="f">В работе</option>
            <option value="c">Завершена</option>
            <option value="r">Отклонена</option>
          </select>
        </label>
      </div>
      <div className="dinners-list">
        {dinners.map((dinner) => (
          <DinnerCard
            key={dinner.id}
            id={dinner.id}
            tableNumber={dinner.table_number}
            status={dinner.status as 'f' | 'c' | 'r'}
            formedAt={dinner.formed_at}
            totalCost={dinner.total_cost}
            qr={dinner.status !== 'f' ? dinner.qr : undefined}
            onClick={() => handleRowClick(dinner.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default DinnersPage;
