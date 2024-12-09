import React from 'react';

interface DinnerCardProps {
  id: number;
  tableNumber: number;
  status: 'f' | 'c' | 'r';
  formedAt: string | null;
  totalCost: number;
  qr?: string;
  onClick: () => void;
}

const getStatusText = (status: 'f' | 'c' | 'r') => {
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

const DinnerCard: React.FC<DinnerCardProps> = ({ id, tableNumber, status, formedAt, totalCost, qr, onClick }) => {
  return (
    <div className={`dinner-card ${status}`} onClick={onClick}>
      <div className="dinner-info">
        <h2>Заказ №{id}</h2>
        <p>Номер стола: {tableNumber}</p>
        <p className="status">Статус: {getStatusText(status)}</p>
        <p>Дата оформления: {formedAt ? new Date(formedAt).toLocaleString() : '—'}</p>
        {(status === 'c' || status === 'r') && <p>Общая стоимость: {totalCost} ₽</p>}
      </div>
      {qr && (
        <div className="qr-container">
          <img className="qr-code" src={`data:image/png;base64,${qr}`} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default DinnerCard;
