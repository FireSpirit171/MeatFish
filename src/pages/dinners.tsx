import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { fetchDinners, setFilters } from '../store/dinnerSlice';
import DinnerCard from '../components/DinnerCard';
import { Dinner } from '@/api/Types';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

const TableHeader = () => (
  <div className="table-header">
    <div className="header-info">
      <div className="header-item order-id">№ Заказа</div>
      <div className="header-item table-number">№ Стола</div>
      <div className="header-item status">Статус</div>
      <div className="header-item date-formed">Дата оформления</div>
      <div className="header-item qr">QR</div>
    </div>
  </div>
);

const DinnersPage = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const router = useRouter();
  const { dinners, dateFrom, dateTo, status, loading, error } = useSelector((state: RootState) => state.dinners);

  useEffect(() => {
    dispatch(fetchDinners());
  }, [dispatch, dateFrom, dateTo, status]);

  const handleRowClick = (id: number) => {
    router.push(`/dinners/${id}`);
  };

  const handleFilterChange = () => {
    dispatch(setFilters({ dateFrom, dateTo, status }));
    dispatch(fetchDinners());
  };

  return (
    <div className="dinners-page">
      <h1>Ваши заказы</h1>
      {error && <div className="error">{error}</div>}
      <div className="filters">
        <label>
          Дата от:
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => dispatch(setFilters({ dateFrom: e.target.value, dateTo, status }))}
          />
        </label>
        <label>
          Дата до:
          <input
            type="date"
            value={dateTo}
            onChange={(e) => dispatch(setFilters({ dateFrom, dateTo: e.target.value, status }))}
          />
        </label>
        <label>
          Статус:
          <select value={status} onChange={(e) => dispatch(setFilters({ dateFrom, dateTo, status: e.target.value }))}>
            <option value="">Все</option>
            <option value="f">В работе</option>
            <option value="c">Завершена</option>
            <option value="r">Отклонена</option>
          </select>
        </label>
      </div>

      {/* Заголовок таблицы */}
      <TableHeader />

      {/* Список заказов */}
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="dinners-list">
          {dinners.map((dinner: Dinner) => (
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
      )}
    </div>
  );
};

export default DinnersPage;
