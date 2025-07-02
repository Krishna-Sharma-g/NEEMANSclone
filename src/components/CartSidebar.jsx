import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartItemsCount,
    addToCart
  } = useCart();

  const bestSellingProducts = [
    {
      id: 'sole-max-slip-ons',
      title: 'Sole Max Slip Ons : Ultra Black',
      price: 1529,
      originalPrice: 2999,
      image: 'https://neemans.com/cdn/shop/files/ND-SoleMaxSlipOn-UltraBlack-_WebOptimized_a.jpg?v=1724988371&width=800',
      variant_title: 'Ultra Black'
    },
    {
      id: 'tread-basics-grey',
      title: 'Tread Basics : Grey',
      price: 1099,
      originalPrice: 3699,
      image: 'https://neemans.com/cdn/shop/files/ND-TB-Grey-_WebOptimized_a_eb690643-6131-4b53-86da-c1b5c2b55803_200x.jpg?v=1733919776',
      variant_title: 'Grey'
    },
    {
      id: 'crossover-brogues-black',
      title: 'Crossover Brogues : Black',
      price: 2749,
      originalPrice: 5199,
      image: 'https://neemans.com/cdn/shop/files/ND_-CRB-_Black_3_b9d26dd6-304a-4988-93a3-efbe35964b3c.jpg?v=1743665432&width=800',
      variant_title: 'Black'
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (item, newQuantity) => {
  if (newQuantity <= 0) {
    removeFromCart(item.id, item.variant_id);
  } else {
    updateQuantity(item.id, newQuantity, item.variant_id);
  }
};


  const handleCheckout = () => {
    alert('Checkout functionality would be implemented here');
    onClose();
  };

  const handleAddBestSelling = (product) => {
    addToCart(product);
  };
  return (
    <>
      <div 
        className={`cart-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />
      <div className={`cart-sidebar ${isOpen ? 'active' : ''}`}>
        <div className="cart-sidebar-header">
          <h2>Shopping Cart ({getCartItemsCount()})</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-sidebar-content">
          {cart.items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
                  <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"></path>
                  <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
                </svg>
              </div>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started</p>
              <div className="best-selling-section">
                <div className="best-selling-header">
                    <span className="best-selling-title">Best Selling 🚀</span>
                  </div>
                  <div className="best-selling-products">
                    {bestSellingProducts.map((product) => (
                      <div key={product.id} className="best-selling-item">
                        <div className="best-selling-image">
                          <img src={product.image} alt={product.title} />
                        </div>
                        <div className="best-selling-info">
                          <h5>{product.title}</h5>
                          <div className="best-selling-price">
                            <span className="current-price">{formatPrice(product.price)}</span>
                            <span className="original-price">{formatPrice(product.originalPrice)}</span>
                          </div>
                        </div>
                        <button 
                          className="add-best-selling-btn"
                          onClick={() => handleAddBestSelling(product)}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.items.map((item) => (
                  <div key={`${item.id}-${item.variant_id}`} className="cart-sidebar-item">
                    <div className="item-image">
                      <img src={item.image || '/placeholder-product.jpg'} alt={item.title} />
                    </div>
                    
                    <div className="item-info">
                      <h4>{item.title}</h4>
                      {item.variant_title && (
                        <p className="variant-info">{item.variant_title}</p>
                      )}
                      <div className="item-price-qty">
                        <span className="price">{formatPrice(item.price)}</span>
                        <div className="quantity-controls">
                          <button onClick={() => handleQuantityChange(item, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => handleQuantityChange(item, item.quantity + 1)}> + </button>
                        </div>
                      </div>
                    </div>

                    <div className="item-actions">
                      <div className="item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id, item.variant_id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="3,6 5,6 21,6"></polyline>
                          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-sidebar-footer">
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>
                      {formatPrice(
                        getCartTotal() + 
                        (getCartTotal() >= 1999 ? 0 : 99) + 
                        (getCartTotal() * 0.18)
                      )}
                    </span>
                  </div>
                </div>
                
                <div id="details">
                    <img src="https://cdn.shopify.com/s/files/1/2428/5565/files/Brand_Offerings_Side_cart_and_cart_page_New.png?v=1750401357" alt="Brand Offerings" />
                </div>
                <div className="cart-actions">
                  <Link 
                    to="/cart" 
                    className="view-cart-btn"
                    onClick={onClose}
                  >
                    View Cart
                  </Link>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Checkout
                  </button>
                </div>

                <div>
                  <img src="https://cdn.shopify.com/s/files/1/2428/5565/files/Secure_Transaction_Strip_Side_cart_and_cart_page.svg?v=1732528366"></img>
                </div>
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;