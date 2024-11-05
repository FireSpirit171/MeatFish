import React from "react";

const Header: FC = () => {
    return(
        <nav className="header">
            <a href="#">
                <img src="../../../public/logo.png" width="120" height="120" />
            </a>
            <div className="header__center">
                <div className="header__title-container">
                    <h1 className="header__title-container__title"><strong>Meat'n'Fish</strong></h1>
                </div>
            </div>
        </nav>
    )
}

export default Header;