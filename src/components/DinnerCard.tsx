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
        <p className="order-id">{id}</p>
        <p className="table-number">{tableNumber}</p>
        <p className="status">{getStatusText(status)}</p>
        <p className="date-formed">{formedAt ? new Date(formedAt).toLocaleDateString() : '—'}</p>
      </div>
      <div className="dinner-icon">
        {status === 'f' ? (
          <img className="status-icon" src="/time.svg" alt="Time Icon" />
        ) : (
          <div className="qr-hover-wrapper">
            <img className="status-icon" src="/href.svg" alt="QR Icon" />
            <div className="qr-hover">
              {qr && <img className="qr-code" src={`data:image/png;base64,${qr}`} alt="QR Code" />}
              <p>Общая стоимость: {totalCost} ₽</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DinnerCard;