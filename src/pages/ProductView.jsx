import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const extractBaseNameAndColor = (title) => {
  // e.g., "Ease Walk Neo : Black" => { baseName: "Ease Walk Neo", color: "Black" }
  const parts = title.split(":");
  if (parts.length > 1) {
    return {
      baseName: parts.slice(0, -1).join(":").trim(),
      color: parts[parts.length - 1].trim(),
    };
  }
  return { baseName: title.trim(), color: "" };
};

const ProductView = () => {
  const { productHandle } = useParams();
  const navigate = useNavigate();
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
  const [colorVariants, setColorVariants] = useState([]);
  const [allProductsLoaded, setAllProductsLoaded] = useState(false);

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

    const fetchAllProductsPaginated = async () => {
      let page = 1;
      let fetched = [];
      let hasMore = true;
      while (hasMore) {
        const res = await fetch(`https://neemans.com/collections/all-products/products.json?page=${page}`);
        const data = await res.json();
        if (!data.products || data.products.length === 0) {
          hasMore = false;
        } else {
          fetched = [...fetched, ...data.products];
          page += 1;
        }
      }
      setAllProducts(fetched);
      setAllProductsLoaded(true);
    };

    fetchProduct();
    fetchAllProductsPaginated();
  }, [productHandle]);

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  useEffect(() => {
    if (allproducts.length > 0 && product) {
      const { baseName } = extractBaseNameAndColor(product.title);
      // Find all products with the same base name
      const variants = allproducts.filter(p => {
        const { baseName: otherBase } = extractBaseNameAndColor(p.title);
        return otherBase.toLowerCase() === baseName.toLowerCase();
      });
      setColorVariants(variants);
    }
  }, [allproducts, product]);

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

  const { baseName, color: currentColor } = extractBaseNameAndColor(product.title);

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
          <hr className="section-divider" />

          

          {/* Color Section */}
          {colorVariants.length > 1 && (
            <div className="color-selection" style={{ margin: '18px 0 18px 0' }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Color: <span style={{ fontWeight: 700, color: '#222' }}>{currentColor}</span></div>
              <div style={{ display: 'flex', gap: 12 }}>
                {colorVariants.map(variant => {
                  const { color } = extractBaseNameAndColor(variant.title);
                  const isSelected = variant.handle === product.handle;
                  return (
                    <div
                      key={variant.id}
                      className={`color-swatch${isSelected ? ' selected' : ''}`}
                      style={{ border: isSelected ? '2px solid #222' : '2px solid transparent', cursor: isSelected ? 'default' : 'pointer', background: '#fff', width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 0, boxSizing: 'border-box' }}
                      onClick={() => {
                        if (!isSelected) navigate(`/product/${variant.handle}`);
                      }}
                      title={color}
                    >
                      <img
                        src={variant.images[0]?.src}
                        alt={color}
                        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 0, border: '1px solid #eee', opacity: isSelected ? 1 : 0.8, background: '#fff' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
          <hr className="section-divider" />
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
          <hr className="section-divider" />
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
          <hr className="section-divider" />
        </div>
      </div>
      <CartSidebar 
      isOpen={showCartSidebar} 
      onClose={() => setShowCartSidebar(false)} />
    </div>
  );
};

export default ProductView;