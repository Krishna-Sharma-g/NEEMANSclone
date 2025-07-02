import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartItemsCount 
  } = useCart();

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
  };

  if (cart.items.length === 0) {
    return (
      <div className="App">
        <Navbar />
        <div className="cart-empty">
          <div className="container">
            <div className="empty-cart-content">
              <div className="empty-cart-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
                  <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"></path>
                  <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
                </svg>
              </div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <Link to="/" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <h1>Shopping Cart ({getCartItemsCount()} items)</h1>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          <div className="cart-layout">
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={`${item.id}-${item.variant_id}`} className="cart-item">
                  <div className="item-image">
                    <img src={item.image || '/placeholder-product.jpg'} alt={item.title} />
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    {item.variant_title && (
                      <p className="variant-info">{item.variant_title}</p>
                    )}
                    <p className="item-price">{formatPrice(item.price)}</p>
                  </div>

                  <div className="item-quantity">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <p>{formatPrice(item.price * item.quantity)}</p>
                  </div>

                  <button 
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.id, item.variant_id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal ({getCartItemsCount()} items)</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{getCartTotal() >= 1999 ? 'Free' : formatPrice(99)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax</span>
                  <span>{formatPrice(getCartTotal() * 0.18)}</span>
                </div>
                
                <hr />
                
                <div className="summary-row total">
                  <span>Total</span>
                  <span>
                    {formatPrice(
                      getCartTotal() + 
                      (getCartTotal() >= 1999 ? 0 : 99) + 
                      (getCartTotal() * 0.18)
                    )}
                  </span>
                </div>

                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>

                <Link to="/" className="continue-shopping-link">
                  Continue Shopping
                </Link>
              </div>

              <div className="shipping-info">
                <h4>Shipping Information</h4>
                <p>🚚 Free shipping on orders above ₹1999</p>
                <p>📦 Estimated delivery: 3-5 business days</p>
                <p>↩️ 30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
