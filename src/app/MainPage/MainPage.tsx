import {Component, ReactNode} from "react";
import APIClient from "../../api/APIClient";
import { Dish } from "../../api/Type";

import DishCard from "../../components/DishCard/DishCard";

interface MainPageState {
    dishes: Dish[];
    draftId: number| null;
    dishesInBucket: number;
    loading: boolean;
    error: string | null;
}

class MainPage extends Component<{}, MainPageState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            dishes: [],
            draftId: null,
            dishesInBucket: 0,
            loading: true,
            error: null
        }
    }

    async getDishes() {
        try{
            const response = await APIClient.getDishes();
            const data = await response.json();
            this.setState({
                dishes: data.dishes,
                draftId: data.draft_dinner_id,
                dishesInBucket: data.total_dish_count,
                loading: false,
            });
        } catch (error) {
            this.setState({
                error: error.message || "Ошибка загрузки данных",
                loading: false,
            })
            console.log('error: ', error);
        }
    }

    componentDidMount(): void {
        this.getDishes()
    }

    render(): ReactNode {
        const { dishes, draftId, dishesInBucket, loading, error } = this.state;

        if (loading){
            return <div>Загрузка...</div>
        }

        if (error) {
            return <div>Ошибка {error}</div>
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
                                <img src="../../public/basket.png" width="60px" height="60px" className="main-page__basket-column__basket__img"/>
                                <span className="main-page__basket-column__basket__dish-in-draft">{dishesInBucket}</span>
                            </div>
                        </span>
                    </div>
                </main>
            </>
        )
    }
}

export default MainPage;