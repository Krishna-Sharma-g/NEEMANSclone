import React, { useState } from 'react';
import './Slider.css';

const slides = [
  {
    image: 'https://neemans.com/cdn/shop/files/1920X800_Desktop_Banner_06787013-8711-4e09-8c07-cb09ee213a14.jpg?v=1750951745&width=1500',
    href: 'https://neemans.com/products/begin-walk-flow'
  },
  {
    image: 'https://neemans.com/cdn/shop/files/1920X800_-_Desktop_Banner_Cushers.jpg?v=1749889879&width=1500',
    href: '#'
  },
  {
    image: 'https://neemans.com/cdn/shop/files/BWT_-_Desktop_Banner.jpg?v=1751290410&width=1500',
    href: '#'
  },
  {
    image: 'https://neemans.com/cdn/shop/files/1920X800_Desktop_Banner.jpg?v=1750788112&width=1500',
    href: '#'
  },
  {
    image: 'https://neemans.com/cdn/shop/files/1920X800_Desktop_Banner.jpg?v=1750788112&width=1500',
    href: '#'
  },

];

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <div className="slider-container">
      <div className="slide">
        <a href={slides[currentSlide].href}>
          <img src={slides[currentSlide].image} alt="Slider" />
        </a>
      </div>
      <button className="prev-btn" onClick={prevSlide}>&#10094;</button>
      <button className="next-btn" onClick={nextSlide}>&#10095;</button>
      <div className="pagination-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slider; 