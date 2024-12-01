import { FC, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { login } from "../store/userSlice";
import ApiClient from "@/api/APIClient";
import { getCookie } from "../api/Utils";

const Header: FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const sessionId = getCookie('session_id');
        if (sessionId) {
            const checkSession = async () => {
                const response = await ApiClient.getSession();
                const data = await response.json()
                if (data.status == 'ok' && data.username) {
                    dispatch(login(data.username));
                }
            };
            checkSession();
        }
    }, [dispatch]);

    return (
        <header className="header">
            <Link href="/">
                <img src="/logo.png" width="120" height="120" alt="Логотип" className="header__img1"/>
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
                <Link href="/dinners" className={`header__nav-item ${router.pathname === "/dishes" ? "active" : ""}`}>
                    Заказы
                </Link>
                {isLoggedIn ? (
                    <>
                        <img
                            src="/default_user.png"
                            alt="User"
                            className="header__user-icon"
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
