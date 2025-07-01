import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/ProductView.css";

const ProductView = () => {
  const { productName } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allproducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://neemans.com/products/begin-walk-glide.json`);
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await response.json();
        setProduct(data.product);
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
  }, [productName]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="product-view">
      <div className="product-images">
        {product.images.map((image, index) => (
          <img key={index} src={image.src} alt={product.title} />
        ))}
      </div>
      <div className="product-details">
        <h1>{product.title}</h1>
        <div className="price-section">
          <span className="price">Rs. {product.variants[0].price}</span>
          <span className="mrp">
            <span> MRP </span>
            <span className="strikethrough">Rs. {product.variants[0].compare_at_price}</span>
          </span>
          <span className="discount"> 
            {Math.floor(
              ((product.variants[0].compare_at_price - product.variants[0].price) /
                product.variants[0].compare_at_price) *
                100
            )}
            % OFF
          </span>
        </div>
        <p className="tax-info">MRP Inclusive of all taxes</p>
         
        <div class="emi">
          <div class="emi-text">
            <span class="emi-text-1">Pay</span>
            <b>₹</b>
            <span class="emi-text-2">{Math.floor(product.variants[0].price/3)}</span>
            <span class="emi-text-3">/month</span>
          </div>
          <div>
            <span class="emi-slogan">0% Interest EMI via
            <img src="https://preemi.snapmint.com/assets/whitelable/UPI-Logo-vector%201.svg"  alt="upi" class="upi-img"></img>
            </span>
            
          </div>
        </div>
        <div className="product_variant">
            <span class="color">Color :</span>
            <span className="product_color">{product.title.split(" : ")[1]}</span>
            <span>

            </span>

        </div>
        <button className="add-to-cart">ADD TO CART</button>
        <button className="buy-now">BUY NOW</button>
        <p className="emi-info">Get this for as low as Rs. 2609 with these offers.</p>
        <h4>Product Details:</h4>
        <ul>
          <li>Outer Material: Elastic Stretch Knit</li>
          <li>Sole Material: Rubber & EVA (Ethylene Vinyl Acetate)</li>
          <li>Closure Type: Lace Up</li>
          <li>Shoe Size Width: Medium</li>
          <li>Toe Style: Almond Toe</li>
          <li>Arch Type: Medium Arch</li>
          <li>Water-Resistant: No</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductView;