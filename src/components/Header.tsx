import { FC, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { login, logout } from "../store/userSlice";
import { resetCart } from "../store/cartSlice";
import { resetFilters } from "@/store/filterSlice";
import ApiClient from "@/api/APIClient";
import { getCookie, deleteCookie } from "../api/Utils";

const Header: FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isLoggedIn, userName } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const sessionId = getCookie("session_id");
        if (sessionId) {
            const checkSession = async () => {
                const response = await ApiClient.getSession();
                const data = await response.json();
                if (data.status === "ok" && data.username) {
                    dispatch(login(data.username));
                }
            };
            checkSession();
        }
    }, [dispatch]);

    const handleLogout = async () => {
        try {
            const response = await ApiClient.logout();
            if (response.ok) {
                router.push("/");
                deleteCookie("session_id");
                dispatch(resetCart());
                dispatch(resetFilters());
                dispatch(logout());
            } else {
                console.error("Ошибка при логауте");
            }
        } catch (error) {
            console.error("Ошибка при логауте:", error);
        }
    };
    

    return (
        <header className="header">
            <Link href="/">
                <img src="/logo.png" width="120" height="120" alt="Логотип" className="header__img1" />
            </Link>
            <div className="header__center">
                <div className="header__title-container">
                    <h1 className="header__title-container__title">
                        <strong>Meat'n'Fish</strong>
                    </h1>
                </div>
            </div>
            <nav className="header__nav">
                <Link href="/dishes" className={`header__nav-item ${router.pathname === "/dishes" ? "active" : ""}`}>
                    Меню
                </Link>
                <Link href="/dinners" className={`header__nav-item ${router.pathname === "/dinners" ? "active" : ""}`}>
                    Заказы
                </Link>
                {isLoggedIn ? (
                    <>
                        <div className="header__user">
                            <Link href="/profile">
                                <img
                                    src="/default_user.png"
                                    alt="User"
                                    className="header__user-icon"
                                />
                            </Link>
                            <span className="header__user-email">{userName}</span>
                        </div>
                        <img
                            src="/exit.svg"
                            alt="Logout"
                            className="header__logout-icon"
                            onClick={handleLogout}
                        />
                    </> 
                ) : (
                    <Link href="/auth" className={`header__nav-item ${router.pathname === "/auth" ? "active" : ""}`}>
                        Войти
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
