import React from 'react';

interface HorizontalDishCardProps {
  id: number;
  photo: string;
  name: string;
  price: number;
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void; // Новый обработчик для удаления
  isEditable: boolean;
}

const HorizontalDishCard: React.FC<HorizontalDishCardProps> = ({
  id,
  photo,
  name,
  price,
  count,
  onIncrease,
  onDecrease,
  onDelete,
  isEditable,
}) => {
  return (
    <div id={`dish-${id}`} className="horizontal-dish-card">
      <div className="card-row">
        <div className="image-container">
          <a href={`/dishes/${id}`}>
            <img src={photo} alt={name} className="dish-image" />
          </a>
        </div>
        <div className="content">
          <a href={`/dishes/${id}`} className="dish-name-link">
            <h3 className="dish-name">{name}</h3>
          </a>
          <div className="bottom-row">
            <div className="dish-price">{price} ₽</div>
            <div className="quantity-control">
              <div className="dish-count">{count} шт.</div>
              <div className="controls">
                <span
                  className={`control-btn ${!isEditable ? 'disabled' : ''}`}
                  onClick={isEditable ? onDecrease : undefined}
                >
                  −
                </span>
                <span className="divider"></span>
                <span
                  className={`control-btn ${!isEditable ? 'disabled' : ''}`}
                  onClick={isEditable ? onIncrease : undefined}
                >
                  +
                </span>
              </div>
            </div>
            {isEditable && (
              <div className="trash-icon" onClick={onDelete}>
                <img src="/trash.svg" alt="Удалить" className='trash'/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalDishCard;
