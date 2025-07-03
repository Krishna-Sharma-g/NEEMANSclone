import React, { useState, useEffect } from 'react';
import './ProductSlider.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/CartSidebar.css';
import CartSidebar from '../components/CartSidebar';

// Sample data structure. This will be replaced by the data fetched from your URL.
// const sampleProducts = [
//   { id: 1, name: 'Begin Walk Glide : Teal', image: 'https://neemans.com/cdn/shop/files/814_1_25c7e114-9727-4663-b184-e3f9a744a69e.jpg?v=1719990595&width=360', price: 2899, originalPrice: 3799, discount: '23% OFF', isNew: true },
//   { id: 2, name: 'Begin Walk Flow : Ivory', image: 'https://neemans.com/cdn/shop/files/1_2_3.jpg?v=1719990547&width=360', price: 2999, originalPrice: 3899, discount: '23% OFF', isNew: true },
//   { id: 3, name: 'Knit Trainers For Women : Pink', image: 'https://neemans.com/cdn/shop/files/1_15_f4d54627-2b73-4f0e-a611-65b1285038c7.jpg?v=1719990547&width=360', price: 2499, originalPrice: 3499, discount: '28% OFF', isNew: true },
//   { id: 4, name: 'Knit Trainers For Men : Ivory Brown', image: 'https://neemans.com/cdn/shop/files/1_14_42633d7b-449e-4e42-881c-16db132d7331.jpg?v=1719990547&width=360', price: 2499, originalPrice: 3499, discount: '28% OFF', isNew: true },
//   { id: 5, name: 'Knit Glide For Men : Brown', image: 'https://neemans.com/cdn/shop/files/1_3_b6a13205-d142-4f71-a48e-d4aa717d23d9.jpg?v=1719990595&width=360', price: 2199, originalPrice: 3299, discount: '33% OFF', isNew: true },
//   { id: 6, name: 'Another Shoe', image: 'https://via.placeholder.com/300x300?text=Shoe+6', price: 1999, originalPrice: 2499, discount: '20% OFF', isNew: true },
//   { id: 7, name: 'Another Shoe', image: 'https://via.placeholder.com/300x300?text=Shoe+7', price: 1999, originalPrice: 2499, discount: '20% OFF', isNew: true },
// ];

// Placeholder categories data
// const categories = [
//   {
//     label: 'SNEAKERS',
//     image: 'https://via.placeholder.com/200x200?text=Sneakers',
//     route: '/sneakers',
//   },
//   {
//     label: 'SLIP-ONS',
//     image: 'https://via.placeholder.com/200x200?text=Slip-Ons',
//     route: '/slip-ons',
//   },
//   {
//     label: 'LOAFERS',
//     image: 'https://via.placeholder.com/200x200?text=Loafers',
//     route: '/loafers',
//   },
//   {
//     label: 'OXFORDS',
//     image: 'https://via.placeholder.com/200x200?text=Oxfords',
//     route: '/oxfords',
//   },
// ];

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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
    fetch('https://neemans.com/collections/newest-products/products.json')
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
      <div className="after-view-all-image-container">
        <img src="assets/banner2.png" alt="Banner after View All Products" className="after-view-all-image" />
      </div>
      <div className="slider-header">
        <h2 className="slider-title">New Launches</h2>
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
      {/* Add the view all button here */}
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
        <img src="assets/banner3.png" alt="Banner after View All Products" className="after-view-all-image" />
      </div>
      <CartSidebar 
        isOpen={showCartSidebar} 
        onClose={() => setShowCartSidebar(false)} 
      />
    </section>
  );
};

export default ProductSlider;