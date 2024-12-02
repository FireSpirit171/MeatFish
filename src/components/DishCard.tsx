import { FC } from "react";
import { useRouter } from "next/router";
import { Dish } from "../api/Types";
import ApiClient from "../api/APIClient";
import { useDispatch } from "react-redux";
import { setDraftDinner, setTotalDishCount } from "../store/cartSlice"; 

const DishCard: FC<{ dish: Dish }> = ({ dish }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = () => {
    router.push(`/dishes/${dish.id}`);
  };

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      const response = await ApiClient.addDishToDraft(dish.id);
      const data = await response.json()

      if (data.draft_dinner_id) {
        dispatch(setDraftDinner({
          draftDinnerId: data.draft_dinner_id,
          totalDishCount: data.total_dish_count
        }));
        dispatch(setTotalDishCount(data.total_dish_count)); 
      }
    } catch (error) {
      console.error("Ошибка при добавлении блюда в корзину:", error);
    }
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
        <button className="dish-card__button-container__button" onClick={handleAddToCart}>
          Добавить в корзину
        </button>
      </div>
    </div>
  );
};

export default DishCard;
