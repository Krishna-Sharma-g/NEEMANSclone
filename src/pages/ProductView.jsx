import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from '../components/Navbar';
import "../styles/ProductView.css";
import { useCart } from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';

const extractProductDetails = (bodyHtml) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(bodyHtml, 'text/html');
  const details = {};
  const firstParagraph = doc.querySelector('p');
  details.description = firstParagraph ? firstParagraph.textContent.trim() : '';
  const listItems = doc.querySelectorAll('li');
  const specifications = [];
  listItems.forEach(item => {
    const strongElement = item.querySelector('strong');
    if (strongElement) {
      const key = strongElement.textContent.replace(':', '').trim();
      const value = item.textContent.replace(strongElement.textContent, '').trim();
      specifications.push({ key, value });
    }
  });
  details.specifications = specifications;
  return details;
};

const ProductView = () => {
  const { productHandle } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allproducts, setAllProducts] = useState([]);
  const { addToCart, isInCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [thumbnailStart, setThumbnailStart] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const VISIBLE_THUMBNAILS = 4;
  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleThumbnailScroll = (direction) => {
    if (!product.images) return;
    if (direction === 'up') {
      if (thumbnailStart === 0) {
        setThumbnailStart(product.images.length - VISIBLE_THUMBNAILS);
      } else {
        setThumbnailStart(thumbnailStart - 1);
      }
    } else if (direction === 'down') {
      if (thumbnailStart >= product.images.length - VISIBLE_THUMBNAILS) {
        setThumbnailStart(0);
      } else {
        setThumbnailStart(thumbnailStart + 1);
      }
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://neemans.com/products/${productHandle}.json`);
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await response.json();
        setProduct(data.product);
        
        // Extract product details from body_html
        const extractedDetails = extractProductDetails(data.product.body_html);
        setProductDetails(extractedDetails);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    const handleBlink = (e) => {
    const btn = e.currentTarget;
    btn.classList.remove('blink');
    void btn.offsetWidth;         
    btn.classList.add('blink');
};
    const fetchAllProducts = async () => {
        try {
            const response = await fetch(`https://neemans.com/products.json`);
            if (!response.ok) {
            throw new Error("Failed to fetch all products data");
            }
            const data = await response.json();
            setAllProducts(data.products);
        } catch (err) {
            console.error(err.message);
        }
        }

    fetchProduct();
  }, [productHandle]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  if (loading || !product || !product.images || !product.variants) {
    return (
      <div className="App">
        <Navbar />
        <div className="loading">
          <div>Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <Navbar />
        <div className="error">
          <div>Error: {error}</div>
        </div>
      </div>
    );
  }

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleAddToCart = () => {
    if (productInCart) return;
    setIsAddingToCart(true);
    const productToAdd = {
      id: product.id,
      title: product.title,
      price: selectedVariant.price,
      image: product.images[selectedImage]?.src,
      variant_title: (
        selectedVariant.title && selectedVariant.title.match(/\d+/)
          ? `Size: ${selectedVariant.title.match(/\d+/)[0]}`
          : (selectedVariant.title && selectedVariant.title.length > 0
              ? `Size: ${selectedVariant.title}`
              : `Size: ${selectedVariant.id}`)
      ),
      variant_id: selectedVariant.id
    };
    addToCart(productToAdd);
    setShowCartSidebar(true);
    setTimeout(() => setIsAddingToCart(false), 500); // Simulate feedback
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product.id, selectedVariant.id);
    } else {
      updateQuantity(product.id, newQuantity, selectedVariant.id);
    }
  };

  const currentQuantity = getItemQuantity(product.id, selectedVariant ? selectedVariant.id : undefined);
  const productInCart = isInCart(product.id, selectedVariant ? selectedVariant.id : undefined);

  console.log("Product variants:", product.variants);

  return (
    <div className="App">
      <Navbar />
      <div className="product-view">
        {/* Column 1: Thumbnails Carousel */}
        <div className="vertical-thumbnails">
          <button
            className="carousel-arrow up"
            onClick={() => handleThumbnailScroll('up')}
            disabled={!product.images || product.images.length === 0}
          >
            {/* Chevron Up SVG */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12.5L10 7.5L15 12.5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {product.images && product.images.slice(thumbnailStart, thumbnailStart + 4).map((image, index) => (
            <img
              key={thumbnailStart + index}
              src={image.src}
              alt={`${product.title} view ${thumbnailStart + index + 1}`}
              className={`thumbnail ${selectedImage === (thumbnailStart + index) ? 'active' : ''}`}
              onClick={() => handleImageClick(thumbnailStart + index)}
            />
          ))}
          <button
            className="carousel-arrow down"
            onClick={() => handleThumbnailScroll('down')}
            disabled={!product.images || product.images.length === 0}
          >
            {/* Chevron Down SVG */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Column 2: Main Image */}
        <div className="main-image">
          {product.images && product.images[selectedImage] && (
            <img
              src={product.images[selectedImage].src}
              alt={product.title}
              className="main-product-image"
            />
          )}
        </div>

        {/* Column 3: Product Details */}
        <div className="product-details">
          <div className="product-badge">
            
          </div>
          <h1>{product.title}</h1>
          
          <div className="price-section">
            <span className="price">Rs. {selectedVariant ? selectedVariant.price : ''}</span>
            {selectedVariant && selectedVariant.compare_at_price && (
              <>
                <span className="mrp">
                  <span> MRP </span>
                  <span className="strikethrough">₹{selectedVariant.compare_at_price}</span>
                </span>
                <span className="discount"> 
                  {Math.floor(
                    ((selectedVariant.compare_at_price - selectedVariant.price) /
                      selectedVariant.compare_at_price) *
                      100
                  )}
                  % OFF
                </span>
              </>
            )}
          </div>
          <p className="tax-info">MRP Inclusive of all taxes</p>
          
          

          {/* EMI Section */}
          <div className="emi">
            <div className="emi-text">
              <span className="emi-text-1">Pay</span>
              <b>₹</b>
              <span className="emi-text-2">{selectedVariant ? Math.floor(selectedVariant.price/3) : ''}</span>
              <span className="emi-text-3">/month</span>
            </div>
            <div>
              <span className="emi-slogan">0% Interest EMI via
                <img src="https://preemi.snapmint.com/assets/whitelable/UPI-Logo-vector%201.svg" alt="upi" className="upi-img" />
              </span>
            </div>
          </div>

          {/* Size Selection */}
          <div className="size-selection">
            <h4>Select Size (UK) :</h4>
            <div className="sizes">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  className={`size-button ${selectedVariant && selectedVariant.id === variant.id ? 'selected' : ''}`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant.title && variant.title.match(/\d+/)
                    ? variant.title.match(/\d+/)[0]
                    : (variant.title && variant.title.length > 0
                        ? variant.title
                        : `Size ${variant.id}`)}
                </button>
              ))}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="add-to-cart" 
              onClick={handleAddToCart}
              disabled={isAddingToCart || !(selectedVariant) || productInCart}
            >
              {productInCart ? 'IN CART' : (isAddingToCart ? 'ADDING...' : 'ADD TO CART')}
            </button>
            <button className="buy-now" disabled={!(selectedVariant)}>
              BUY NOW
            </button>
          </div>

          {/* Product Description and Details (dynamic) */}
          <div className="product-description-section">
            <h3 className="desc-title">DESCRIPTION</h3>
            {productDetails.description && (
              <p className="desc-text">{productDetails.description}</p>
            )}
            {productDetails.specifications && productDetails.specifications.length > 0 && (
              <>
                <h4 className="details-title">Product Details:</h4>
                <ul className="details-list">
                  {productDetails.specifications.map((spec, idx) => (
                    <li key={idx}>
                      <strong>{spec.key}:</strong> {spec.value}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
      <CartSidebar 
      isOpen={showCartSidebar} 
      onClose={() => setShowCartSidebar(false)} />
    </div>
  );
};

export default ProductView;