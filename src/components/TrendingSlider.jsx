import React, { useState, useEffect } from 'react';
import './TrendingSlider.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';

const Trendingslider = ({ onViewAll }) => {
  const [products, setProducts] = useState([]);
  const { addToCart, isInCart } = useCart();
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    const productToAdd = {
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      variant_title: product.name.split(" : ")[1] || 'Default',
      variant_id: product.id
    };
    addToCart(productToAdd);
    setShowCartSidebar(true);
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  useEffect(() => {
    fetch('https://neemans.com/collections/trending-products/products.json')
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
        <h2 className="slider-title">Trending</h2>
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
              <button 
                className="add-to-cart-btn" 
                onClick={(e) => handleAddToCart(e, product)}
                disabled={isAddingToCart || isInCart(product.id)}
              >
                {isInCart(product.id) ? 'IN CART' : (isAddingToCart ? 'ADDING...' : 'ADD TO CART')}
              </button>
            </Link>
          ))}
        </div>
      </div>
      <div className="view-all-container">
        <button
          className="view-all-btn"
          onClick={() => {
            navigate('/collections/all-products');
          }}
        >
          VIEW ALL PRODUCTS <span className="arrow">&rarr;</span>
        </button>
      </div>
      <br />
      <div className="after-view-all-image-container">
        <img src="assets/testimonial.png" alt="Banner after View All Products" className="after-view-all-image" />
      </div>
      <CartSidebar 
        isOpen={showCartSidebar} 
        onClose={() => setShowCartSidebar(false)} 
      />
    </section>
  );
};

export default Trendingslider;