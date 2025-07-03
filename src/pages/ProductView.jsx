import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from '../components/Navbar';
import "../styles/ProductView.css";
import { useCart } from '../context/CartContext';

const VISIBLE_THUMBNAILS = 4;

const ProductView = () => {
  const { productHandle } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allproducts, setAllProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [productDetails, setProductDetails] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { addToCart } = useCart();
  const [thumbnailStart, setThumbnailStart] = useState(0);

  // Function to extract product details from body_html
  const extractProductDetails = (bodyHtml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(bodyHtml, 'text/html');
    const details = {};
    
    // Extract the main description
    const firstParagraph = doc.querySelector('p');
    details.description = firstParagraph ? firstParagraph.textContent.trim() : '';
    
    // Extract specifications from the list
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://neemans.com/products/${productHandle}.json`);
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await response.json();
        setProduct(data.product);
        setSelectedVariant(data.product.variants[0]);
        
        // Extract product details from body_html
        const extractedDetails = extractProductDetails(data.product.body_html);
        setProductDetails(extractedDetails);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
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

  if (loading) {
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

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    
    setIsAddingToCart(true);
    
    try {
      const productToAdd = {
        id: product.id,
        title: product.title,
        price: selectedVariant.price,
        image: product.images[0]?.src,
        variant_title: selectedVariant.title,
        variant_id: selectedVariant.id
      };
      
      await addToCart(productToAdd);
      
      // Show success feedback (you can add a toast notification here)
      console.log('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const calculateDiscount = () => {
    if (!selectedVariant.compare_at_price) return 0;
    return Math.floor(
      ((selectedVariant.compare_at_price - selectedVariant.price) /
        selectedVariant.compare_at_price) *
        100
    );
  };
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleThumbnailScroll = (direction) => {
    if (direction === 'up') {
      if (thumbnailStart === 0) {
        // Loop to the end
        setThumbnailStart(product.images.length - VISIBLE_THUMBNAILS);
      } else {
        setThumbnailStart(thumbnailStart - 1);
      }
    } else if (direction === 'down') {
      if (thumbnailStart >= product.images.length - VISIBLE_THUMBNAILS) {
        // Loop to the start
        setThumbnailStart(0);
      } else {
        setThumbnailStart(thumbnailStart + 1);
      }
    }
  };

  return (
    <div className="App">
      <Navbar />
      <div className="product-view">
        {/* Column 1: Thumbnails Carousel */}
        <div className="vertical-thumbnails">
          <button
            className="carousel-arrow up"
            onClick={() => handleThumbnailScroll('up')}
          >
            {/* Chevron Up SVG */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12.5L10 7.5L15 12.5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {product.images.slice(thumbnailStart, thumbnailStart + VISIBLE_THUMBNAILS).map((image, index) => (
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
          >
            {/* Chevron Down SVG */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Column 2: Main Image */}
        <div className="main-image">
          <img
            src={product.images[selectedImage]?.src}
            alt={product.title}
            className="main-product-image"
          />
        </div>

        {/* Column 3: Product Details */}
        <div className="product-details">
          <div className="product-badge">
            
          </div>
          <h1>{product.title}</h1>
          
          <div className="price-section">
            <span className="price">Rs. {selectedVariant.price}</span>
            {selectedVariant.compare_at_price && (
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
              <span className="emi-text-2">{Math.floor(selectedVariant.price/3)}</span>
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
                  className={`size-button ${selectedVariant.id === variant.id ? 'selected' : ''}`}
                  onClick={() => handleVariantChange(variant)}
                >
                  {variant.title.match(/\d+/)[0]}
                </button>
              ))}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="add-to-cart" 
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariant}
            >
              {isAddingToCart ? 'ADDING...' : 'ADD TO CART'}
            </button>
            <button className="buy-now" disabled={!selectedVariant}>
              BUY NOW
            </button>
          </div>

          {/* Product Description */}
          {productDetails.description && (
            <div className="product-description">
              <p>{productDetails.description}</p>
            </div>
          )}

          {/* Product Specifications */}
          {productDetails.specifications && productDetails.specifications.length > 0 && (
            <div className="product-specifications">
              <h4>Product Details:</h4>
              <ul>
                {productDetails.specifications.map((spec, index) => (
                  <li key={index}>
                    <strong>{spec.key}:</strong> {spec.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductView;