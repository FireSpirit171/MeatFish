import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import APIClient from '../../api/APIClient';
import { Dish } from '../../api/Types';
import Breadcrumbs from '../../components/Breadcrumbs';
import { mockDishes } from '../../mockdata';

const DishPage: FC = () => {
  const { id } = useRouter().query;
  const [dish, setDish] = useState<Dish | null>(null);
  const [dishLoading, setDishLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Таймаут запроса')), 2000)
        );

        const response = await Promise.race([APIClient.getDish(id as string), timeout]);
        const data = await response.json();
        setDish(data);
      } catch (error: any) {
        const mockDish = mockDishes.dishes.find(dish => dish.id.toString() === id);
        if (mockDish) {
          setDish(mockDish);
        }
        setError(error.message || 'Ошибка загрузки блюда');
      } finally {
        setDishLoading(false);
      }
    };

    if (id) fetchDish();
  }, [id]);

  return (
    <>
      <Breadcrumbs dishName={!dishLoading && dish ? dish.name : undefined} />
      {dishLoading ? (
        <div className="loading">Загрузка блюда...</div>
      ) : (
        <div className="dish-container">
          <div className="dish-container__img-container">
            <img
              src={dish?.photo}
              className="dish-container__img-container__img js-scale-img"
              alt={dish?.name}
            />
          </div>
          <div className="dish-container__info-container">
            <h1 className="dish-container__info-container__title">{dish?.name}</h1>
            <p className="dish-container__info-container__description">{dish?.description}</p>
            <span className="dish-container__info-container__price-container">
              <p className="dish-container__info-container__price-container__price">{dish?.price}р. /</p>
              <p className="dish-container__info-container__price-container__title">{dish?.weight} г.</p>
            </span>
          </div>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </>
  );
};

export default DishPage;
