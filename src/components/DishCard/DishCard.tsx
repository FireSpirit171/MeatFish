import { FC } from "react";
import { Dish } from "../../api/Type";

const DishCard: FC<{ dish: Dish }> = ({ dish }) => {
    return (
        <div className="dish-card">
            <img src={dish.photo} alt={dish.name} />
            <h3>{dish.name}</h3>
        </div>
    );
};

export default DishCard;
