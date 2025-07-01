import React, { useState, useEffect, useRef } from 'react';
import './ReviewSlider.css';

const reviews = [
  {
    rating: 5,
    title: 'Worthy product',
    text: 'Worthy products..worth for money and very comfortable..nice one',
    name: 'Dinesh selvaraj',
    product: 'Purewhoosh Breeze : Black',
  },
  {
    rating: 5,
    title: 'Best quality shoes',
    text: 'After wearing this shoes, I feel very light and perfect fit and with amazing quality. Looking more...',
    name: 'Kasim Shariff',
    product: 'The Breezy Loafers : Black',
  },
  {
    rating: 5,
    title: 'Very comfortable sandal',
    text: 'After trying lots of brands I landed on this.. A sustainable choice without compromising ...',
    name: 'Prashant',
    product: 'Purewhoosh Flow : Black',
  },
  {
    rating: 5,
    title: 'Superb',
    text: 'Superb quality and comfort. Will buy again!',
    name: 'Amit Kumar',
    product: 'Wool Joggers : Grey',
  },
  {
    rating: 5,
    title: 'Great for daily use',
    text: 'Perfect for daily use and very stylish.',
    name: 'Sneha Rao',
    product: 'Classic Sneakers : White',
  },
];

const ReviewSlider = () => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef();
  const cardsPerView = 3;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % reviews.length);
  };

  // Get the 3 reviews to show
  const getVisibleReviews = () => {
    const visible = [];
    for (let i = 0; i < cardsPerView; i++) {
      visible.push(reviews[(current + i) % reviews.length]);
    }
    return visible;
  };

  return (
    <div className="review-slider-section">
      <div className="review-slider-cards">
        {getVisibleReviews().map((review, idx) => (
          <div className="review-card" key={idx}>
            <div className="review-stars">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </div>
            <div className="review-title"><b>{review.title}</b></div>
            <div className="review-text">{review.text}</div>
            <div className="review-name">{review.name}</div>
            <div className="review-product">{review.product}</div>
          </div>
        ))}
      </div>
      <div className="review-slider-nav">
        <button className="review-arrow" onClick={prevSlide}>&lt;</button>
        <button className="review-arrow" onClick={nextSlide}>&gt;</button>
      </div>
    </div>
  );
};

export default ReviewSlider; 