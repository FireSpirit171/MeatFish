import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import APIClient from "../../api/APIClient";
import { Dish } from "../../api/Type";

const DishPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const [dish, setDish] = useState<Dish | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDish = async () => {
            try {
                const response = await APIClient.getDish(id);
                const data = await response.json()
                setDish(data);
            } catch (error: any) {
                setError(error.message || "Ошибка загрузки блюда");
            } finally {
                setLoading(false);
            }
        };

        fetchDish();
    }, [id]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="dish-container">
            <div className="dish-container__img-container">
                <img src={dish?.photo} className="dish-container__img-container__img js-scale-img"/>
            </div>
            <div className="dish-container__info-container">
                <h1 className="dish-container__info-container__title">{dish?.name}</h1>
                <p className="dish-container__info-container__description">{dish?.description}</p>
                <span className="dish-container__info-container__price-container">
                    <p className="dish-container__info-container__price-container__price">{dish?.price}р. /</p>
                    <p className="dish-container__info-container__price-container__title"> {dish?.weight} г.</p>
                </span>
            </div>
        </div>
    );
};

export default DishPage;
