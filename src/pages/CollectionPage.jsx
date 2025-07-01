import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './CollectionPage.css';

function Collections({ handle }) {
  // Product data
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);

  // Filter states
  const [gender, setGender] = useState('');
  const [productType, setProductType] = useState('');
  const [collection, setCollection] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [discount, setDiscount] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const title = handle.replace(/-/g, ' ').toUpperCase();

  // Fetch all products on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      let page = 1;
      let fetched = [];
      let hasMore = true;
      while (hasMore) {
        const res = await axios.get(
          `https://neemans.com/collections/${handle}/products.json?page=${page}`
        );
        if (res.data.products.length === 0) {
          hasMore = false;
        } else {
          fetched = [...fetched, ...res.data.products];
          page += 1;
        }
      }
      setAllProducts(fetched);
      setProducts(fetched);
    };
    fetchAllProducts();
  }, [handle]);

  // Filtering logic
  useEffect(() => {
    let filtered = [...allProducts];

    if (gender) filtered = filtered.filter(p => p.tags.some(tag => tag.toLowerCase().includes(gender.toLowerCase())));
    if (productType) filtered = filtered.filter(p => p.product_type === productType);
    if (collection) filtered = filtered.filter(p => p.tags.some(tag => tag.toLowerCase().includes(collection.toLowerCase())));
    if (color) filtered = filtered.filter(p => p.tags.some(tag => tag.toLowerCase().includes(color.toLowerCase())));
    if (size) filtered = filtered.filter(p => p.variants.some(v => v.title === size));
    filtered = filtered.filter(p => {
      const price = parseFloat(p.variants[0]?.price || p.price || 0);
      return price >= minPrice && price <= maxPrice;
    });
    if (discount) {
      filtered = filtered.filter(p => {
        const variant = p.variants[0];
        if (!variant) return false;
        const price = parseFloat(variant.price);
        const compare = parseFloat(variant.compare_at_price || price);
        if (!compare || compare <= price) return false;
        const disc = Math.round(((compare - price) / compare) * 100);
        return disc >= parseInt(discount);
      });
    }

    // Sorting
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => parseFloat(a.variants[0]?.price) - parseFloat(b.variants[0]?.price));
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => parseFloat(b.variants[0]?.price) - parseFloat(a.variants[0]?.price));
    } else if (sortBy === 'title-asc') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title-desc') {
      filtered.sort((a, b) => b.title.localeCompare(a.title));
    }
    // Default: featured (no sort or as fetched)

    setProducts(filtered);
  }, [allProducts, gender, productType, collection, color, size, minPrice, maxPrice, discount, sortBy]);

  // Filter options
  const genderOptions = ['Men', 'Women'];
  const productTypeOptions = [
    'Clogs', 'Flats', 'Flip Flops', 'Loafers', 'Oxfords', 'Sandals', 'Slides', 'Slip On', 'Sneakers'
  ];
  const collectionOptions = [
    'Casual', 'Chunky', 'Daily Use', 'Extra Soft', 'Formal', 'Outdoor', 'Retro', 'Signature', 'Sports', 'Trendy', 'Walking'
  ];
  const colorOptions = [
    'Beige', 'Berry', 'Black', 'Blue', 'Brown', 'Green', 'Grey', 'Ivory', 'Ivory Brown', 'Multicolor', 'Neon', 'Olive', 'Olive Green', 'Orange', 'Pink', 'Purple', 'Red', 'Tan', 'Teal', 'White', 'Yellow'
  ];
  const sizeOptions = ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];
  const discountOptions = [
    { label: '30% and above', value: '30' },
    { label: '40% and above', value: '40' },
    { label: '50% and above', value: '50' },
    { label: '60% and above', value: '60' },
    { label: '70% and above', value: '70' }
  ];

  return (
    <div className="collection-main">
      <aside className="collection-sidebar">
        <h3>Sort & Filters</h3>
        <div className="filter-group">
          <label>Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value)}>
            <option value="">All</option>
            {genderOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Product Type</label>
          <select value={productType} onChange={e => setProductType(e.target.value)}>
            <option value="">All</option>
            {productTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Collection</label>
          <select value={collection} onChange={e => setCollection(e.target.value)}>
            <option value="">All</option>
            {collectionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Color</label>
          <select value={color} onChange={e => setColor(e.target.value)}>
            <option value="">All</option>
            {colorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Size</label>
          <select value={size} onChange={e => setSize(e.target.value)}>
            <option value="">All</option>
            {sizeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Price</label>
          <div className="price-range">
            <input type="number" min="0" max="5000" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} />
            <span> - </span>
            <input type="number" min="0" max="5000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} />
          </div>
        </div>
        <div className="filter-group">
          <label>Discount</label>
          <select value={discount} onChange={e => setDiscount(e.target.value)}>
            <option value="">All</option>
            {discountOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </aside>
      <main className="collection-content">
        <div className="collection-header">
          <h3 className="collection-title">{title}</h3>
          <div className="sort-by">
            <label>Sort by: </label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Name: A-Z</option>
              <option value="title-desc">Name: Z-A</option>
            </select>
          </div>
        </div>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img className="product-image" src={product.images[0]?.src} alt={product.title} />
              <h4 className="product-title">{product.title}</h4>
              <p className="product-price">
                ₹{parseFloat(product.variants[0]?.price || product.price).toLocaleString()}
                {product.variants[0]?.compare_at_price && parseFloat(product.variants[0].compare_at_price) > parseFloat(product.variants[0].price) && (
                  <span className="product-compare">₹{parseFloat(product.variants[0].compare_at_price).toLocaleString()}</span>
                )}
              </p>
              {product.variants[0]?.compare_at_price && parseFloat(product.variants[0].compare_at_price) > parseFloat(product.variants[0].price) && (
                <span className="product-discount">
                  {Math.round(((parseFloat(product.variants[0].compare_at_price) - parseFloat(product.variants[0].price)) / parseFloat(product.variants[0].compare_at_price)) * 100)}% OFF
                </span>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Collections;