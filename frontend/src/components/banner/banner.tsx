
import Slider from 'react-slick';
import './banner.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const images = [
  'https://bizweb.dktcdn.net/100/439/653/themes/838421/assets/slider_1.jpg?1689645476809',
  'https://bizweb.dktcdn.net/100/439/653/themes/838421/assets/slider_2.jpg?1689645476809',
  'https://bizweb.dktcdn.net/100/361/762/themes/799709/assets/slider_1.jpg?1677439920610'
];

const showNowTexts = ['Top-notch Furniture', 'Top-notch Furniture'];

const Banner = () => {
  const CustomPrevArrow = (props:any) => {
    const { className, onClick } = props;
    return (
      <button  className={className} onClick={onClick}>
        Prev
      </button>
    );
  };

  const CustomNextArrow = (props:any) => {
    const { className, onClick } = props;
    return (
      <button style={{zIndex:"2"}} className={className} onClick={onClick}>
        Next
      </button>
    );
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    nextArrow: <CustomPrevArrow  to="next" />,
    prevArrow: <CustomNextArrow to="prev" />,
  };

  return (
    <div className='banner'>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <div className='image-container'>
              <div className="banner-img">
                <img src={image} alt={`Image ${index + 1}`} />

              </div>
              {/* <div className="text-container">
                <h1>{showNowTexts[index]}</h1>
                <p>Sofa Store provides the best furniture and accessories for homes and offices.</p>
                <button className='show-now-button'>SHOW NOW</button>

              </div> */}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;