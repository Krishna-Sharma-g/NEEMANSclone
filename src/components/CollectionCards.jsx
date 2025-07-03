import React from 'react';
import './CollectionCards.css';
import { Link } from 'react-router-dom';

const collections = [
  {
    title: 'MEN',
    image: 'https://neemans.com/cdn/shop/files/For_Men.jpg?v=1712743136&width=400',
    handle: 'men',
  },
  {
    title: 'WOMEN',
    image: 'https://neemans.com/cdn/shop/files/For_Women.jpg?v=1712743136&width=400',
    handle: 'women',
  },
  {
    title: 'LIMITED STOCK',
    image: 'https://neemans.com/cdn/shop/files/Limited_Stock_Banner.jpg?v=1741084491&width=400',
    handle: 'limited-stock',
  },
  {
    title: 'TRENDING',
    image: 'https://neemans.com/cdn/shop/files/For_Men-1.jpg?v=1712743136&width=400',
    handle: 'trending-collection',
  },
];

const CollectionCards = () => {
  return (
    <section className="collection-section">
      <h2 className="collection-title">Shop by collection</h2>
      <div className="collection-cards">
        {collections.map((col, idx) => (
          <Link className="collection-card" to={`/collections/${col.handle}`} key={idx}>
            <img src={col.image} alt={col.title} />
          </Link>
        ))}
      </div>
      <div className="view-all-container">
        <button className="view-all-btn">
          VIEW ALL PRODUCTS <span className="arrow">&rarr;</span>
        </button>
      </div>
    </section>
  );
};

export default CollectionCards; 