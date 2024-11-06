import { FC } from "react";
import { Dish } from "../../api/Type";
import { useNavigate } from "react-router-dom";

const DishCard: FC<{ dish: Dish }> = ({ dish }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/dishes/${dish.id}`); // Переход на страницу блюда с ID
    };

    return (
        <div className="dish-card" onClick={handleClick} style={{ cursor: "pointer" }}>
            <div>
                <img src={dish.photo} className="dish-card__img js-scale-img" alt={dish.name} />
                <h3 className="dish-card__title">{dish.name}</h3>
                <span className="dish-card__info">
                    <p className="dish-card__info__price">{dish.price}р.</p>
                    <p className="dish-card__info__slash">/</p>
                    <p className="dish-card__info__weight">{dish.weight}г.</p>
                </span>
                <p className="dish-card__type">Категория: {dish.type}</p>
            </div>
            <div className="dish-card__button-container">
                <button className="dish-card__button-container__button">Добавить в корзину</button>
            </div>
        </div>
    );
};

export default DishCard;