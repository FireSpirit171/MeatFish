import { useEffect, useState, useCallback } from "react";
import APIClient from "../api/APIClient";
import { Dish } from "../api/Types";
import DishCard from "../components/DishCard";
import { mockDishes } from "../mockdata";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setPriceRange } from "../store/filterSlice";
import { setDraftDinner } from "../store/cartSlice";
import { useRouter } from "next/router";

interface DishesResponse {
  dishes: Dish[]
  draft_dinner_id: number,
  total_dish_count: number
}

const debounce = <T extends (...args: any[]) => void>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { minRange, maxRange } = useSelector((state: RootState) => state.filter);
  const { totalDishCount, draftDinnerId } = useSelector((state: RootState) => state.cart);

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDishes = async (minPrice?: number, maxPrice?: number): Promise<void> => {
    try {
      let url = "";
      if (minPrice !== undefined && maxPrice !== undefined) {
        url += `?min_price=${minPrice}&max_price=${maxPrice}`;
      }

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Таймаут запроса")), 2000)
      );

      const response = await Promise.race([
        APIClient.getDishes(url),
        timeout,
      ]);
      const data = await response.json() as DishesResponse;

      setDishes(data.dishes);
      dispatch(
        setDraftDinner({
          draftDinnerId: data.draft_dinner_id,
          totalDishCount: data.total_dish_count,
        })
      );
      setLoading(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const filteredMockDishes = mockDishes.dishes.filter((dish) => {
          const withinMinPrice = minPrice !== undefined ? dish.price >= minPrice : true;
          const withinMaxPrice = maxPrice !== undefined ? dish.price <= maxPrice : true;
          return withinMinPrice && withinMaxPrice;
        });

        setDishes(filteredMockDishes);
        setError(err.message);
      } else {
        setError("Ошибка загрузки данных");
        console.log(error)
      }
      setLoading(false);
    }
  };

  const debouncedGetDishes = useCallback(
    debounce((minPrice: number, maxPrice: number) => {
      getDishes(minPrice, maxPrice);
    }, 500),
    []
  );  

  useEffect(() => {
    debouncedGetDishes(minRange, maxRange);
  }, [minRange, maxRange, debouncedGetDishes]);

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

  if (loading) {
    return (
      <div className="loading">
        <img src="/loading.webp" alt="Загрузка..." />
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
