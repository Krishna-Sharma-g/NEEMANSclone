import React, { useState, useEffect } from 'react';
import './TrendingSlider.css';
import { Link } from 'react-router-dom';

const bestseller = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://neemans.com/collections/best-selling-products/products.json')
      .then(res => res.json())
      .then(data => {
        const mappedProducts = data.products.map(p => {
          const price = parseFloat(p.variants[0].price);
          const originalPrice = parseFloat(p.variants[0].compare_at_price);
          let discount = null;
          if (originalPrice && price < originalPrice) {
            discount = `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`;
          }

          return {
            id: p.id,
            handle: p.handle,
            name: p.title,
            image: p.images[0]?.src,
            price: price,
            originalPrice: originalPrice,
            discount: discount,
            isNew: p.tags.includes('new'),
          };
        });
        setProducts(mappedProducts.slice(0, 12));
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <section className="product-slider-section">
      
      <div className="slider-header">
        <h2 className="slider-title">Best Seller</h2>
        <div className="slider-nav">
          <button className="nav-arrow prev-arrow">&lt;</button>
          <button className="nav-arrow next-arrow">&gt;</button>
        </div>
      </div>
     
      <div className="product-slider-container">
        <div className="product-slider">
          {products.map((product) => (
            <Link to={`/product/${product.handle}`} key={product.id} className="product-card">
              {product.isNew && <div className="new-badge">NEW</div>}
              <img src={product.image} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <div className="product-price">
                <span className="current-price">Rs. {product.price}</span>
                <span className="original-price">Rs. {product.originalPrice}</span>
                <span className="discount">{product.discount}</span>
              </div>
              <button className="add-to-cart-btn">ADD TO CART</button>
            </Link>
          ))}

        </div>
      </div>
      <br />
      <div className="after-view-all-image-container">
        <img src="assets/banner4.png" alt="Banner after View All Products" className="after-view-all-image" />
      </div>
       <div className="after-view-all-image-container">
        <img src="assets/banner5.png" alt="Banner after View All Products" className="after-view-all-image" />
      </div>
    </section>
    
  );
};

export default bestseller; 