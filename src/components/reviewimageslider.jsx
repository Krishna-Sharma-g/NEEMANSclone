import React, { useState, useEffect } from 'react';
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

const ReviewImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const goToSlide = (slideIndex) => {
    if (!isTransitioning && slideIndex !== currentSlide) {
      setIsTransitioning(true);
      setCurrentSlide(slideIndex);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Auto-slide functionality
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, isTransitioning, isPaused]);

  return (
    <div
      className="slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="slides-wrapper">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <a href={slide.href}>
              <img src={slide.image} alt={`Review Slide ${index + 1}`} />
            </a>
          </div>
        ))}
      </div>
      <button className="prev-btn" onClick={prevSlide} disabled={isTransitioning}>
        &#10094;
      </button>
      <button className="next-btn" onClick={nextSlide} disabled={isTransitioning}>
        &#10095;
      </button>
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

export default ReviewImageSlider; 