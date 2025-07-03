import axios from 'axios';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useInView } from 'react-intersection-observer';
import './CollectionPage.css';

function Collections() {
  const { handle } = useParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const title = handle.replace(/-/g, ' ').toUpperCase();

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });
  const fetchProductsPage = useCallback(async (pageNum, reset = false) => {
    setLoading(true);
    let url = `https://neemans.com/collections/${handle}/products.json?page=${pageNum}`;
    const res = await axios.get(url);
    let fetched = res.data.products || [];
    setProducts(prev => reset ? fetched : [...prev, ...fetched]);
    setHasMore(fetched.length > 0);
    setLoading(false);
  }, [handle]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProductsPage(1, true);
  }, [handle, fetchProductsPage]);

  useEffect(() => {
    if (inView && hasMore && !loading && page > 1) {
      fetchProductsPage(page);
    }
  }, [inView]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [inView, hasMore, loading]);
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

  // Dropdown open/close state for each filter
  const [openDropdown, setOpenDropdown] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    gender: '',
    productType: '',
    collection: '',
    color: '',
    size: '',
    discount: '',
  });

  // Close dropdowns when clicking outside
  const sidebarRef = useRef(null);
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpenDropdown('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Handler for radio selection
  const handleFilterSelect = (filter, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: prev[filter] === value ? '' : value
    }));
    setOpenDropdown('');
  };

  return (
    <div className="collection-main">
      <aside className="collection-sidebar" ref={sidebarRef}>
        {/* <h3>Sort & Filters</h3> -- removed heading */}
        <div className="filter-group">
          <div className="custom-dropdown-wrap">
            <button
              className={`custom-dropdown-btn${openDropdown === 'gender' ? ' open' : ''}`}
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'gender' ? '' : 'gender')}
            >
              {selectedFilters.gender || 'Select Gender'}
              <span className={`arrow${openDropdown === 'gender' ? ' up' : ''}`} />
            </button>
            {openDropdown === 'gender' && (
              <ul className="custom-dropdown-list">
                <li>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      checked={selectedFilters.gender === ''}
                      onChange={() => handleFilterSelect('gender', '')}
                    />
                    All
                  </label>
                </li>
                {genderOptions.map(opt => (
                  <li key={opt}>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        checked={selectedFilters.gender === opt}
                        onChange={() => handleFilterSelect('gender', opt)}
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="filter-group">
          <div className="custom-dropdown-wrap">
            <button
              className={`custom-dropdown-btn${openDropdown === 'productType' ? ' open' : ''}`}
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'productType' ? '' : 'productType')}
            >
              {selectedFilters.productType || 'Select Product Type'}
              <span className={`arrow${openDropdown === 'productType' ? ' up' : ''}`} />
            </button>
            {openDropdown === 'productType' && (
              <ul className="custom-dropdown-list">
                <li>
                  <label>
                    <input
                      type="radio"
                      name="productType"
                      checked={selectedFilters.productType === ''}
                      onChange={() => handleFilterSelect('productType', '')}
                    />
                    All
                  </label>
                </li>
                {productTypeOptions.map(opt => (
                  <li key={opt}>
                    <label>
                      <input
                        type="radio"
                        name="productType"
                        checked={selectedFilters.productType === opt}
                        onChange={() => handleFilterSelect('productType', opt)}
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="filter-group">
          <div className="custom-dropdown-wrap">
            <button
              className={`custom-dropdown-btn${openDropdown === 'collection' ? ' open' : ''}`}
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'collection' ? '' : 'collection')}
            >
              {selectedFilters.collection || 'Select Collection'}
              <span className={`arrow${openDropdown === 'collection' ? ' up' : ''}`} />
            </button>
            {openDropdown === 'collection' && (
              <ul className="custom-dropdown-list">
                <li>
                  <label>
                    <input
                      type="radio"
                      name="collection"
                      checked={selectedFilters.collection === ''}
                      onChange={() => handleFilterSelect('collection', '')}
                    />
                    All
                  </label>
                </li>
                {collectionOptions.map(opt => (
                  <li key={opt}>
                    <label>
                      <input
                        type="radio"
                        name="collection"
                        checked={selectedFilters.collection === opt}
                        onChange={() => handleFilterSelect('collection', opt)}
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="filter-group">
          <div className="custom-dropdown-wrap">
            <button
              className={`custom-dropdown-btn${openDropdown === 'color' ? ' open' : ''}`}
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'color' ? '' : 'color')}
            >
              {selectedFilters.color || 'Select Color'}
              <span className={`arrow${openDropdown === 'color' ? ' up' : ''}`} />
            </button>
            {openDropdown === 'color' && (
              <ul className="custom-dropdown-list">
                <li>
                  <label>
                    <input
                      type="radio"
                      name="color"
                      checked={selectedFilters.color === ''}
                      onChange={() => handleFilterSelect('color', '')}
                    />
                    All
                  </label>
                </li>
                {colorOptions.map(opt => (
                  <li key={opt}>
                    <label>
                      <input
                        type="radio"
                        name="color"
                        checked={selectedFilters.color === opt}
                        onChange={() => handleFilterSelect('color', opt)}
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="filter-group">
          <div className="custom-dropdown-wrap">
            <button
              className={`custom-dropdown-btn${openDropdown === 'size' ? ' open' : ''}`}
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'size' ? '' : 'size')}
            >
              {selectedFilters.size || 'Select Size'}
              <span className={`arrow${openDropdown === 'size' ? ' up' : ''}`} />
            </button>
            {openDropdown === 'size' && (
              <ul className="custom-dropdown-list">
                <li>
                  <label>
                    <input
                      type="radio"
                      name="size"
                      checked={selectedFilters.size === ''}
                      onChange={() => handleFilterSelect('size', '')}
                    />
                    All
                  </label>
                </li>
                {sizeOptions.map(opt => (
                  <li key={opt}>
                    <label>
                      <input
                        type="radio"
                        name="size"
                        checked={selectedFilters.size === opt}
                        onChange={() => handleFilterSelect('size', opt)}
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="filter-group">
          <div className="custom-dropdown-wrap">
            <button
              className={`custom-dropdown-btn${openDropdown === 'discount' ? ' open' : ''}`}
              type="button"
              onClick={() => setOpenDropdown(openDropdown === 'discount' ? '' : 'discount')}
            >
              {selectedFilters.discount
                ? discountOptions.find(o => o.value === selectedFilters.discount)?.label
                : 'Select Discount'}
              <span className={`arrow${openDropdown === 'discount' ? ' up' : ''}`} />
            </button>
            {openDropdown === 'discount' && (
              <ul className="custom-dropdown-list">
                <li>
                  <label>
                    <input
                      type="radio"
                      name="discount"
                      checked={selectedFilters.discount === ''}
                      onChange={() => handleFilterSelect('discount', '')}
                    />
                    All
                  </label>
                </li>
                {discountOptions.map(opt => (
                  <li key={opt.value}>
                    <label>
                      <input
                        type="radio"
                        name="discount"
                        checked={selectedFilters.discount === opt.value}
                        onChange={() => handleFilterSelect('discount', opt.value)}
                      />
                      {opt.label}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>
      <main className="collection-content">
        <div className="collection-header">
          <h3 className="collection-title">{title}</h3>
          <div className="sort-by">
            <label>Sort by: </label>
            <select>
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
            <Link to={`/product/${product.handle}`} key={product.id} className="product-card">
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
            </Link>
          ))}
          {hasMore && (
            <div ref={sentinelRef} style={{ height: 1 }} />
          )}
          {loading && <div className="loading-indicator">Loading...</div>}
        </div>
      </main>
    </div>
  );
}

export default Collections;