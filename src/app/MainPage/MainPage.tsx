import React, {Component, ReactNode} from "react";
import APIClient from "../../api/APIClient";
import { Dish } from "../../api/Type";

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
            console.log(data);
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
            <div>
                <h1>Главная страница</h1>
                <ul>
                {dishes.map((item) => (
                    <li key={item.id}>{item.name}</li> // Отображение списка данных
                ))}
                </ul>
            </div>
        )
    }
}

export default MainPage;