import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ApiClient from '@/api/APIClient';
import HorizontalDishCard from '@/components/HorizontalDishCard';

const DinnerPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [dinner, setDinner] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDinner = async () => {
      try {
        const response = await ApiClient.getDinnerById(Number(id));
        const data = await response.json();
        setDinner(data);
      } catch (error) {
        console.error('Ошибка загрузки заявки:', error);
      }
    };

    fetchDinner();
  }, [id]);

  if (!dinner) {
    return <div>Загрузка...</div>;
  }

  const isEditable = dinner.status !== 'f' && dinner.status !== 'c' && dinner.status !== 'r';

  // Обработчик для изменения номера стола
  const handleTableNumberBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const newTableNumber = e.target.value;
    try {
      await ApiClient.changeAddFields(Number(id), Number(newTableNumber)); // вызов API функции
      console.log('Номер стола обновлен:', newTableNumber);
    } catch (error) {
      console.error('Ошибка при обновлении номера стола:', error);
    }
  };

  // Обработчик для изменения имени гостя
  const handleGuestBlur = async (e: React.FocusEvent<HTMLInputElement>, dishId: number) => {
    const guest = e.target.value;

    try {
      await ApiClient.changeDishFields(Number(id), dishId, guest); // Вызов метода для изменения имени гостя
      console.log('Имя гостя обновлено:', guest);
    } catch (error) {
      console.error('Ошибка при обновлении имени гостя:', error);
    }
  };

  // Обработчики для изменения количества
  const handleIncrease = async (index: number) => {
    const updatedDishes = [...dinner.dishes];
    updatedDishes[index].count += 1;

    setDinner({ ...dinner, dishes: updatedDishes });

    try {
      await ApiClient.changeDishFields(Number(id), updatedDishes[index].dish.id, undefined, updatedDishes[index].count); // Отправляем новое количество
      console.log('Количество обновлено:', updatedDishes[index].count);
    } catch (error) {
      console.error('Ошибка при обновлении количества:', error);
    }
  };

  const handleDecrease = async (index: number) => {
    const updatedDishes = [...dinner.dishes];
    if (updatedDishes[index].count > 1) {
      updatedDishes[index].count -= 1;

      setDinner({ ...dinner, dishes: updatedDishes });

      try {
        await ApiClient.changeDishFields(Number(id), updatedDishes[index].dish.id, undefined, updatedDishes[index].count); // Отправляем новое количество
        console.log('Количество обновлено:', updatedDishes[index].count);
      } catch (error) {
        console.error('Ошибка при обновлении количества:', error);
      }
    }
  };

  // Обработчик для оформления заказа
  const handleSubmit = async () => {
    try {
      await ApiClient.formDinner(Number(id)); 
      console.log('Заказ оформлен!');
      router.push('/dinners/');
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
    }
  };

  // Обработчик для удаления заказа
  const handleDelete = async () => {
    try {
      await ApiClient.deleteDinner(Number(id));
      console.log('Заказ удален!');
      router.push('/'); 
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    }
  };

  return (
    <div className="dinner-page">
      <h1>Заказ №{dinner.id}</h1>
      <div className="dinner-details">
        {/* Номер стола */}
        <label>
          Номер стола:
          <input
            type="text"
            value={dinner.table_number}
            disabled={!isEditable}
            onChange={(e) =>
              setDinner({ ...dinner, table_number: e.target.value })
            }
            onBlur={handleTableNumberBlur}
          />
        </label>

        {/* Общая стоимость */}
        {!isEditable && dinner.total_cost != 0 && (
          <div className="total-cost">
            Общая стоимость: {dinner.total_cost} ₽
          </div>
        )}

        {/* Карточки блюд */}
        <div className="dinner-items">
          {dinner.dishes.map((item: any, index: number) => (
            <div className="dinner-row" key={index}>
              <HorizontalDishCard
                id={item.dish.id}
                photo={item.dish.photo}
                name={item.dish.name}
                price={item.dish.price}
                count={item.count}
                onIncrease={() => handleIncrease(index)}
                onDecrease={() => handleDecrease(index)}
                onDelete={async () => {
                  try {
                    await ApiClient.deleteDishFromDraft(Number(id), item.dish.id);
                    const updatedDishes = dinner.dishes.filter(
                      (_: any, i: number) => i !== index
                    );
                    setDinner({ ...dinner, dishes: updatedDishes });
                    console.log('Блюдо удалено:', item.dish.name);
                  } catch (error) {
                    console.error('Ошибка при удалении блюда:', error);
                  }
                }}
                isEditable={isEditable}
              />
              <div className="guest-input">
                <input
                  type="text"
                  placeholder="Имя гостя"
                  value={item.guest}
                  disabled={!isEditable}
                  onChange={(e) => {
                    const updatedDishes = [...dinner.dishes];
                    updatedDishes[index].guest = e.target.value;
                    setDinner({ ...dinner, dishes: updatedDishes });
                  }}
                  onBlur={(e) => handleGuestBlur(e, item.dish.id)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка оформления и удаления */}
        <div className="button-container">
          {isEditable ? (
            <>
              <button className="dinner-submit" onClick={handleSubmit}>
                Оформить
              </button>
              <button className="dinner-delete" onClick={handleDelete}>
                Удалить
              </button>
            </>
          ) : (
            <>
              {['c', 'r'].includes(dinner.status) && (
                <div className="qr-code">
                  <img src={`data:image/png;base64,${dinner.qr}`} alt="QR Code" />
                </div>
              )}
              <div className="last-words">
                Спасибо, что выбрали нас!
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DinnerPage;