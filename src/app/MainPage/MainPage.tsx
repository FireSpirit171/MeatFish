import { Component, ReactNode } from "react";
import APIClient from "../../api/APIClient";
import { Dish } from "../../api/Type";

import DishCard from "../../components/DishCard/DishCard";

import { mockDishes } from '../../mockdata';

interface MainPageState {
    dishes: Dish[];
    draftId: number | null;
    dishesInBucket: number;
    loading: boolean;
    error: string | null;
    minRange: number;
    maxRange: number;
}

class MainPage extends Component<{}, MainPageState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            dishes: [],
            draftId: null,
            dishesInBucket: 0,
            loading: true,
            error: null,
            minRange: 1,
            maxRange: 5000,
        };

        this.updatePriceRange = this.updatePriceRange.bind(this); // Привязка контекста
        this.handleSearch = this.handleSearch.bind(this); // Привязка контекста
    }

    async getDishes(minPrice?: number, maxPrice?: number) {
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

            this.setState({
                dishes: data.dishes,
                draftId: data.draft_dinner_id,
                dishesInBucket: data.total_dish_count,
                loading: false,
            });
        } catch (error: any) {
            const filteredMockDishes = mockDishes.dishes.filter(dish => {
                const withinMinPrice = minPrice !== undefined ? dish.price >= minPrice : true;
                const withinMaxPrice = maxPrice !== undefined ? dish.price <= maxPrice : true;
                return withinMinPrice && withinMaxPrice;
            });

            this.setState({
                dishes: filteredMockDishes,
                draftId: null,
                dishesInBucket: filteredMockDishes.length,
                error: error.message || "Ошибка загрузки данных",
                loading: false,
            });
            console.log('error: ', error);
        }
    }
    

    componentDidMount(): void {
        this.getDishes();
    }

    updatePriceRange(event: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;
        const numberValue = Number(value);
    
        if (id === 'min-range') {
            this.setState(prevState => ({
                minRange: Math.min(numberValue, prevState.maxRange)
            }));
        } else if (id === 'max-range') {
            this.setState(prevState => ({
                maxRange: Math.max(numberValue, prevState.minRange)
            }));
        }
    }

    handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const { minRange, maxRange } = this.state;

        console.log("Min Price:", minRange);
        console.log("Max Price:", maxRange);

        const queryParams = new URLSearchParams();
        if (minRange) queryParams.append('min_price', minRange.toString());
        if (maxRange) queryParams.append('max_price', maxRange.toString());
        window.history.pushState({}, '', `?${queryParams.toString()}`);

        this.getDishes(minRange, maxRange);
    }

    render(): ReactNode {
        const { dishes, draftId, dishesInBucket, loading, error, minRange, maxRange } = this.state;

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
                                <img src="/basket.png" width="60px" height="60px" className="main-page__basket-column__basket__img" />
                                <span className="main-page__basket-column__basket__dish-in-draft">{dishesInBucket}</span>
                            </div>
                        </span>
                        
                        <h1 className="main-page__basket-column__price__title">Поиск по цене</h1>
                        <form className="rangeslider" onSubmit={this.handleSearch}>
                            <p id="price-range">{minRange}р. - {maxRange}р.</p>
                            <div className="slider-container">
                                <input 
                                    className="input-ranges" 
                                    id="min-range" 
                                    name="min_value" 
                                    type="range" 
                                    min="1" 
                                    max="5000" 
                                    value={minRange} 
                                    onInput={this.updatePriceRange} 
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
                                    onInput={this.updatePriceRange} 
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
    }
}

export default MainPage;
