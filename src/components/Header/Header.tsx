import { FC } from "react";
import { Link } from "react-router-dom";

const Header: FC = () => {
    return (
        <header className="header">
            <Link to="/">
                <img src="/logo.png" width="120" height="120" alt="Логотип" />
            </Link>
            <div className="header__center">
                <div className="header__title-container">
                    <h1 className="header__title-container__title"><strong>Meat'n'Fish</strong></h1>
                </div>
            </div>
            <div className="header__button-container">
                <Link to="/dishes">  
                    <button className="header__menu-button">Меню</button>
                </Link>
            </div>
        </header>
    );
}

export default Header;
