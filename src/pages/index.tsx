import { FC } from 'react';
import { useRouter } from 'next/router';

const HomePage: FC = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/dishes');
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
