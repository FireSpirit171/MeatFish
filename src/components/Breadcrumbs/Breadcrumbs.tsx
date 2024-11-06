import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbsProps {
    dishName?: string;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ dishName }) => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x && x !== "dishes");

    return (
        <nav className="breadcrumbs">
            <Link to="/dishes" className="breadcrumbs__link">Меню</Link>
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;

                return (
                    <span key={to} className="breadcrumbs__item">
                        {" / "}
                        {isLast && dishName ? (
                            <span className="breadcrumbs__current">{dishName}</span>
                        ) : isLast ? (
                            <span className="breadcrumbs__current">{value}</span>
                        ) : (
                            <Link to={to} className="breadcrumbs__link">{value}</Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
