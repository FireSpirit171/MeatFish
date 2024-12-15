import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { setPriceRange } from "../store/filterSlice";
import { fetchDishes, setDishes } from "../store/dishesSlice";
import { setDraftDinner } from "../store/cartSlice";
import DishCard from "../components/DishCard";
import { useRouter } from "next/router";
import ApiClient from "../api/APIClient";

interface AddDishResponse {
  draft_dinner_id: number;
  total_dish_count: number;
}

const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const MainPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { minRange, maxRange } = useSelector((state: RootState) => state.filter);
  const { totalDishCount, draftDinnerId } = useSelector((state: RootState) => state.cart);
  const { dishes, loading, error } = useSelector((state: RootState) => state.dishes);

  const debouncedGetDishes = useCallback(
    debounce((minPrice: number, maxPrice: number) => {
      const url = minPrice && maxPrice ? `?min_price=${minPrice}&max_price=${maxPrice}` : '';
      dispatch(fetchDishes(url));
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedGetDishes(minRange, maxRange);
  }, [minRange, maxRange, debouncedGetDishes]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await ApiClient.getDishes("");
        const cartData: AddDishResponse = (await response.json()) as AddDishResponse;
        console.log(cartData);
        if (cartData) {
          const { draft_dinner_id, total_dish_count } = cartData;
          dispatch(setDraftDinner({
            draftDinnerId: draft_dinner_id,
            totalDishCount: total_dish_count,
          }));
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных корзины:", error);
      }
    };
    fetchCartData();
  }, [dispatch]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "min-range") {
      dispatch(setPriceRange({ min: Number(value), max: maxRange }));
    } else if (id === "max-range") {
      dispatch(setPriceRange({ min: minRange, max: Number(value) }));
    }
  };

  const handleGoToBasket = () => {
    if (draftDinnerId) {
      router.push(`/dinners/${draftDinnerId}`);
    }
  };

  if (error) {
    return (
      <div className="error">
        <p>Ошибка загрузки данных: {error}</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="title">Меню ресторана</h1>
      <main className="main-page">
        <div className="main-page__left-indent"></div>
        <div className="main-page__dishes-column">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
        <div className="main-page__basket-column">
          <span className="main-page__basket-column__basket">
            <p className="main-page__basket-column__basket__title">Ваша корзина</p>
            <div
              className="main-page__basket-column__basket__img-container"
              onClick={totalDishCount > 0 ? handleGoToBasket : undefined}
              style={{ cursor: totalDishCount > 0 ? "pointer" : "not-allowed" }}
            >
              <img
                src="/basket.png"
                className="main-page__basket-column__basket__img"
                alt="Корзина"
              />
              <span className="main-page__basket-column__basket__dish-in-draft">
                {totalDishCount}
              </span>
            </div>
          </span>
          <div className="rangeslider">
            <div className="main-page__basket-column__price-container">
              <h1 className="main-page__basket-column__price__title">Поиск по цене</h1>
              <p id="price-range">
                {minRange}р. - {maxRange}р.
              </p>
            </div>
            <div className="slider-container">
              <input
                className="input-ranges"
                id="min-range"
                name="min_value"
                type="range"
                min="1"
                max="5000"
                value={minRange}
                onChange={handlePriceChange}
                style={{ width: "90%" }}
              />
              <input
                className="input-ranges"
                id="max-range"
                name="max_value"
                type="range"
                min="1"
                max="5000"
                value={maxRange}
                onChange={handlePriceChange}
                style={{ width: "90%" }}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MainPage;
