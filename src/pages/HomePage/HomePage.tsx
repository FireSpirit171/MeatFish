import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage: FC = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/dishes/');
    };

    return (
        <div className="home-page">
            <img src="/homepage.gif" className="background-gif" />
            <div className="home-page__content">
                <h1 className="home-page__content__title">Добро пожаловать в наш ресторан!</h1>
                <div className="home-page__content__buttons">
                    <button className="home-page__content__buttons__button" onClick={handleButtonClick}>
                        Меню
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
