import { useEffect, useState } from "react";
import APIClient from "../../api/APIClient";
import { Dish } from "../../api/Type";

import DishCard from "../../components/DishCard/DishCard";

import { mockDishes } from '../../mockdata';

const MainPage: React.FC = () => {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [draftId, setDraftId] = useState<number | null>(null);
    const [dishesInBucket, setDishesInBucket] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [minRange, setMinRange] = useState(1);
    const [maxRange, setMaxRange] = useState(5000);

    const getDishes = async (minPrice?: number, maxPrice?: number) => {
        try {
            let url = "";
            if (minPrice !== undefined && maxPrice !== undefined) {
                url += `?min_price=${minPrice}&max_price=${maxPrice}`;
            }

            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Таймаут запроса")), 2000)
            );

            const response = await Promise.race([APIClient.getDishes(url), timeout]);
            const data = await response.json();

            setDishes(data.dishes);
            setDraftId(data.draft_dinner_id);
            setDishesInBucket(data.total_dish_count);
            setLoading(false);
        } catch (error: any) {
            const filteredMockDishes = mockDishes.dishes.filter(dish => {
                const withinMinPrice = minPrice !== undefined ? dish.price >= minPrice : true;
                const withinMaxPrice = maxPrice !== undefined ? dish.price <= maxPrice : true;
                return withinMinPrice && withinMaxPrice;
            });

            setDishes(filteredMockDishes);
            setDraftId(null);
            setDishesInBucket(0);
            setError(error.message || "Ошибка загрузки данных");
            setLoading(false);
            console.log('error: ', error);
        }
    };

    useEffect(() => {
        getDishes();
    }, []);

    const updatePriceRange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        const numberValue = Number(value);

        if (id === 'min-range') {
            setMinRange(prevMin => Math.min(numberValue, maxRange));
        } else if (id === 'max-range') {
            setMaxRange(prevMax => Math.max(numberValue, minRange));
        }
    };

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Min Price:", minRange);
        console.log("Max Price:", maxRange);

        const queryParams = new URLSearchParams();
        if (minRange) queryParams.append('min_price', minRange.toString());
        if (maxRange) queryParams.append('max_price', maxRange.toString());
        window.history.pushState({}, '', `?${queryParams.toString()}`);

        getDishes(minRange, maxRange);
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
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
                        <div className="main-page__basket-column__basket__img-container">
                            <img src="/basket.png" className="main-page__basket-column__basket__img" />
                            <span className="main-page__basket-column__basket__dish-in-draft">{dishesInBucket}</span>
                        </div>
                    </span>

                    <form className="rangeslider" onSubmit={handleSearch}>
                        <div className="main-page__basket-column__price-container">
                            <h1 className="main-page__basket-column__price__title">Поиск по цене</h1>
                            <p id="price-range">{minRange}р. - {maxRange}р.</p>
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
                                onChange={updatePriceRange} 
                                style={{ width: "70%" }}
                            />
                            <input 
                                className="input-ranges" 
                                id="max-range" 
                                name="max_value" 
                                type="range" 
                                min="1" 
                                max="5000" 
                                value={maxRange} 
                                onChange={updatePriceRange} 
                                style={{ width: "70%" }}
                            />
                            <button type="submit" className="rangeslider__button" style={{ marginLeft: "10px" }}>
                                <img src="/search.svg" width="30" alt="Search" />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default MainPage;
