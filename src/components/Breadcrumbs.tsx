import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface BreadcrumbsProps {
    dishName?: string;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ dishName }) => {
    const router = useRouter();
    const pathnames = router.asPath.split("/").filter((x) => x && x !== "dishes");

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
