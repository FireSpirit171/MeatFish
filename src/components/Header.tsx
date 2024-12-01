import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Header: FC = () => {
    const router = useRouter();

    const isActive = (path: string) => router.pathname === path;

    return (
        <header className="header">
            <Link href="/">
                <img src="/logo.png" width="120" height="120" alt="Логотип" />
            </Link>
            <div className="header__center">
                <div className="header__title-container">
                    <h1 className="header__title-container__title">
                        <strong>Meat'n'Fish</strong>
                    </h1>
                </div>
            </div>
            <nav className="header__nav">
                <Link 
                    href="/" 
                    className={`header__nav-item ${isActive("/") ? "active" : ""}`}
                >
                    Главная
                </Link>
                <Link 
                    href="/dishes" 
                    className={`header__nav-item ${isActive("/dishes") ? "active" : ""}`}
                >
                    Меню
                </Link>
            </nav>
        </header>
    );
};

export default Header;
