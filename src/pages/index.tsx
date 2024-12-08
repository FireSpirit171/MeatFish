import { FC } from 'react';
import Slider from 'react-slick'; 

const HomePage: FC = () => {
  const settings = {
    dots: true, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="home-page">
      <Slider {...settings}>
        <div>
          <img src="/homepage.gif" className="background-image" alt="Background gif" />
        </div>
        <div>
          <img src="/homepage2.jpeg" className="background-image" alt="Background image 2" />
        </div>
        <div>
          <img src="/homepage3.jpg" className="background-image" alt="Background image 3" />
        </div>
      </Slider>
      <div className="home-page__content">
        <h1 className="home-page__content__title">Добро пожаловать в наш ресторан!</h1>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default HomePage;
