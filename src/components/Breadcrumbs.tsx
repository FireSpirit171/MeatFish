import { FC } from "react";
import Link from "next/link";

interface BreadcrumbsProps {
    dishName?: string;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ dishName }) => {

    return (
        <nav className="breadcrumbs">
            <Link href="/dishes" className="breadcrumbs__link">Меню</Link>
            {dishName && (
                <span className="breadcrumbs__item">
                    <span className="breadcrumbs__separator"> / </span>
                    <span className="breadcrumbs__current">{dishName}</span>
                </span>
            )}
        </nav>
    );
};

export default Breadcrumbs;
