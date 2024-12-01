import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { login } from "../store/userSlice";
import ApiClient from "../api/APIClient";

const Auth: FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const toggleAuthMode = () => setIsRegister((prev) => !prev);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            let response;
            if (isRegister) {
                response = await ApiClient.auth({ email, password });
                const data = await response.json();
                if (data.status == "Success") {
                    const authResponse = await ApiClient.login({ email, password });
                    const authData = await authResponse.json();
    
                    if (authData.status === "ok") {
                        dispatch(login(authData.username)); 
                        router.push("/dishes");
                    } else {
                        console.log("Ошибка при авторизации");
                    }
                } else {
                    console.log("Ошибка регистрации");  
                }
            } else {
                response = await ApiClient.login({ email, password });
                const data = await response.json();
    
                if (data.status == "ok") {
                    dispatch(login(data.username));
                    router.push("/dishes");
                } else {
                    console.log("Неверный логин или пароль");
                }
            }
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Произошла ошибка. Попробуйте снова.");
        }
    };
    

    return (
        <div className="auth-page">
            <h1>{isRegister ? "Регистрация" : "Вход"}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">
                    {isRegister ? "Зарегистрироваться" : "Войти"}
                </button>
            </form>
            <p>
                {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
                <button type="button" onClick={toggleAuthMode}>
                    {isRegister ? "Войти" : "Регистрация"}
                </button>
            </p>
        </div>
    );
};

export default Auth;
