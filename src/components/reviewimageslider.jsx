import React, { useState } from 'react';
import './Slider.css';

const slides = [
  {
    image: 'https://neemans.com/cdn/shop/files/01_Desktop_New.jpg?v=1744807528&width=1500',
    href: 'https://neemans.com/products/begin-walk-flow'
  },
  {
    image: 'https://neemans.com/cdn/shop/files/02_Desktop_New.jpg?v=1744807528&width=1500',
    href: '#'
  },
  {
    image: 'https://neemans.com/cdn/shop/files/04_Desktop_New.jpg?v=1744807528&width=1500',
    href: '#'
  }

];

const reviewimageSlider = () => {
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

export default reviewimageSlider; 