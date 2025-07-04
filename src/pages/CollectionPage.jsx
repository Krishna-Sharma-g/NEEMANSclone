import axios from 'axios';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useInView } from 'react-intersection-observer';
import { useCart } from '../context/CartContext'; // <-- Add this import
import CartSidebar from '../components/CartSidebar';
import './CollectionPage.css';

// Move filter option arrays OUTSIDE the Collections function so they are always defined before use
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

function Collections() {
  const { handle } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [filterCounts, setFilterCounts] = useState({
    gender: {},
    productType: {},
    collection: {},
    color: {},
    size: {},
    discount: {},
    total: 0,
  });

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
    setAllProducts(prev => reset ? fetched : [...prev, ...fetched]);
    setHasMore(fetched.length > 0);
    setLoading(false);
  }, [handle]);

  // Fetch all products for filter counts (runs once per collection)
  // Instead of storing all products, accumulate counts for each filter as you fetch each page
  const computeCounts = (products, prevCounts) => {
    // Helper to increment counts
    const inc = (obj, key) => {
      obj[key] = (obj[key] || 0) + 1;
    };
    const counts = prevCounts
      ? JSON.parse(JSON.stringify(prevCounts))
      : {
          gender: {},
          productType: {},
          collection: {},
          color: {},
          size: {},
          discount: {},
          total: 0,
        };
    products.forEach(p => {
      // Gender: increment for each gender option if product tags include it
      genderOptions.forEach(opt => {
        if ((p.tags || []).some(tag => tag.toLowerCase().includes(opt.toLowerCase()))) {
          inc(counts.gender, opt);
        }
      });
      inc(counts.gender, ''); // All

      // Product Type: increment if product_type matches option
      productTypeOptions.forEach(opt => {
        if ((p.product_type || '') === opt) inc(counts.productType, opt);
      });
      inc(counts.productType, '');

      // Collection: increment for each collection option if product tags include it
      collectionOptions.forEach(opt => {
        if ((p.tags || []).some(tag => tag.toLowerCase().includes(opt.toLowerCase()))) {
          inc(counts.collection, opt);
        }
      });
      inc(counts.collection, '');

      // Color: increment for each color option if product tags or title include it
      colorOptions.forEach(opt => {
        if (
          (p.tags || []).some(tag => tag.toLowerCase().includes(opt.toLowerCase())) ||
          (p.title || '').toLowerCase().includes(opt.toLowerCase())
        ) {
          inc(counts.color, opt);
        }
      });
      inc(counts.color, '');

      // Size: increment for each size option if any variant title includes it
      sizeOptions.forEach(opt => {
        if ((p.variants || []).some(v => v.title && v.title.includes(opt))) {
          inc(counts.size, opt);
        }
      });
      inc(counts.size, '');

      // Discount: increment for each discount option if discount threshold is met
      discountOptions.forEach(opt => {
        const variant = (p.variants && p.variants[0]) || null;
        if (!variant) return;
        const price = parseFloat(variant.price);
        const compare = parseFloat(variant.compare_at_price || price);
        if (!compare || compare <= price) return;
        const disc = Math.round(((compare - price) / compare) * 100);
        if (disc >= parseInt(opt.value)) {
          inc(counts.discount, opt.value);
        }
      });
      inc(counts.discount, '');

      counts.total++;
    });
    return counts;
  };

  const fetchAllCollectionCounts = useCallback(async () => {
    let pageNum = 1;
    let keepFetching = true;
    let counts = {
      gender: {},
      productType: {},
      collection: {},
      color: {},
      size: {},
      discount: {},
      total: 0,
    };
    while (keepFetching) {
      const url = `https://neemans.com/collections/${handle}/products.json?page=${pageNum}`;
      const res = await axios.get(url);
      const fetched = res.data.products || [];
      if (fetched.length === 0) {
        keepFetching = false;
      } else {
        counts = computeCounts(fetched, counts);
        pageNum++;
      }
    }
    setFilterCounts(counts);
  }, [handle, genderOptions, productTypeOptions, collectionOptions, colorOptions, sizeOptions, discountOptions]);

  useEffect(() => {
    fetchAllCollectionCounts();
  }, [fetchAllCollectionCounts]);

  useEffect(() => {
    setProducts([]);
    setAllProducts([]);
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

  // Dropdown open/close state for each filter
  const [openDropdown, setOpenDropdown] = useState('');
  // Change selectedFilters to support multiple values per filter (array for each)
  const [selectedFilters, setSelectedFilters] = useState({
    gender: [],
    productType: [],
    collection: [],
    color: [],
    size: [],
    discount: [],
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

  // Handler for checkbox selection (multi-select)
  const handleFilterToggle = (filter, value) => {
    setSelectedFilters(prev => {
      const arr = prev[filter];
      if (arr.includes(value)) {
        // Remove value
        return { ...prev, [filter]: arr.filter(v => v !== value) };
      } else {
        // Add value
        return { ...prev, [filter]: [...arr, value] };
      }
    });
    setOpenDropdown('');
  };

  // Handler for removing a single filter from the bubble bar
  const handleRemoveFilter = (filter, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: prev[filter].filter(v => v !== value)
    }));
  };

  // Handler for clearing all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      gender: [],
      productType: [],
      collection: [],
      color: [],
      size: [],
      discount: [],
    });
    setSortBy('featured');
  };

  useEffect(() => {
    let filtered = [...allProducts];

    // Update filter logic to support arrays (multi-select)
    if (selectedFilters.gender.length) {
      filtered = filtered.filter(p =>
        selectedFilters.gender.some(g =>
          (p.tags || []).some(tag => tag.toLowerCase().includes(g.toLowerCase()))
        )
      );
    }

    if (selectedFilters.productType.length) {
      filtered = filtered.filter(p =>
        selectedFilters.productType.includes(p.product_type)
      );
    }

    if (selectedFilters.collection.length) {
      filtered = filtered.filter(p =>
        selectedFilters.collection.some(c =>
          (p.tags || []).some(tag => tag.toLowerCase().includes(c.toLowerCase()))
        )
      );
    }

    if (selectedFilters.color.length) {
      filtered = filtered.filter(p =>
        selectedFilters.color.some(c =>
          (p.tags || []).some(tag => tag.toLowerCase().includes(c.toLowerCase())) ||
          (p.title || '').toLowerCase().includes(c.toLowerCase())
        )
      );
    }

    if (selectedFilters.size.length) {
      filtered = filtered.filter(p =>
        selectedFilters.size.some(s =>
          (p.variants || []).some(v => v.title && v.title.includes(s))
        )
      );
    }

    if (selectedFilters.discount.length) {
      filtered = filtered.filter(p =>
        selectedFilters.discount.some(d => {
          const variant = (p.variants && p.variants[0]) || null;
          if (!variant) return false;
          const price = parseFloat(variant.price);
          const compare = parseFloat(variant.compare_at_price || price);
          if (!compare || compare <= price) return false;
          const disc = Math.round(((compare - price) / compare) * 100);
          return disc >= parseInt(d);
        })
      );
    }

    setFilteredProducts(filtered);
  }, [allProducts, selectedFilters]);

  useEffect(() => {
    let sorted = [...filteredProducts];
    
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => parseFloat(a.variants[0]?.price || 0) - parseFloat(b.variants[0]?.price || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => parseFloat(b.variants[0]?.price || 0) - parseFloat(a.variants[0]?.price || 0));
        break;
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
      default:
        break;
    }
    
    setProducts(sorted);
  }, [filteredProducts, sortBy]);

  // Use global cart context
  const { addToCart, isInCart } = useCart();

  // State for size selection overlay and cart sidebar
  const [showSizeOverlay, setShowSizeOverlay] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Helper to get available sizes for a product
  const getAvailableSizes = (product) => {
    if (!product.variants) return [];
    // Extract unique sizes from variant titles (e.g., "UK 7", "UK 8", etc.)
    const sizes = product.variants
      .map(v => {
        const match = v.title.match(/UK\s?\d+/i);
        return match ? match[0] : null;
      })
      .filter(Boolean);
    return Array.from(new Set(sizes));
  };

  // Handler for Add to Cart button
  const handleAddToCartClick = (product) => {
    setSelectedProduct(product);
    setShowSizeOverlay(true);
    setSelectedSize('');
    setQuantity(1);
  };

  // Handler for selecting a size and adding to cart
  const handleSelectSizeAndAdd = () => {
    if (!selectedProduct || !selectedSize) return;
    // Find the variant matching the selected size
    const variant = (selectedProduct.variants || []).find(v =>
      v.title.toUpperCase().includes(selectedSize)
    );
    if (!variant) return;
    addToCart({
      id: selectedProduct.id,
      title: selectedProduct.title,
      price: parseFloat(variant.price),
      image: selectedProduct.images[0]?.src,
      variant_title: variant.title,
      variant_id: variant.id,
    });
    setShowSizeOverlay(false);
    setShowCartSidebar(true);
    setSelectedProduct(null);
    setSelectedSize('');
  };

  // Handler for closing the overlay
  const handleCloseOverlay = () => {
    setShowSizeOverlay(false);
    setSelectedProduct(null);
    setSelectedSize('');
    setQuantity(1);
  };

  return (
    <>
      <Navbar />
      {/* Size selection overlay */}
      {showSizeOverlay && selectedProduct && (
        <div
          style={{
            position: 'fixed',
            zIndex: 1002,
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleCloseOverlay}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 0,
              padding: '36px 32px 32px 32px',
              minWidth: 370,
              maxWidth: 420,
              width: '90vw',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              position: 'relative',
              zIndex: 1003,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{
                position: 'absolute',
                top: 18,
                right: 22,
                background: 'transparent',
                border: 'none',
                fontSize: 28,
                color: '#222',
                cursor: 'pointer',
                lineHeight: 1,
              }}
              onClick={handleCloseOverlay}
              aria-label="Close"
            >
              ×
            </button>
            <h2 style={{ fontWeight: 800, fontSize: 32, margin: 0, marginBottom: 6, lineHeight: 1.1 }}>
              {selectedProduct.title}
            </h2>
            <div style={{ color: '#888', fontWeight: 500, fontSize: 17, marginBottom: 18 }}>
              NEEMAN'S
            </div>
            <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
              <span style={{ color: '#222' }}>
                Rs. {parseFloat(selectedProduct.variants[0]?.price).toLocaleString()}
              </span>
              {selectedProduct.variants[0]?.compare_at_price &&
                parseFloat(selectedProduct.variants[0].compare_at_price) > parseFloat(selectedProduct.variants[0].price) && (
                  <span style={{
                    textDecoration: 'line-through',
                    color: '#888',
                    fontWeight: 500,
                    marginLeft: 10,
                    fontSize: 18,
                  }}>
                    Rs. {parseFloat(selectedProduct.variants[0].compare_at_price).toLocaleString()}
                  </span>
                )}
            </div>
            <div style={{ fontSize: 17, fontWeight: 500, margin: '18px 0 8px 0' }}>Size</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
              {getAvailableSizes(selectedProduct).map(size => (
                <button
                  key={size}
                  style={{
                    minWidth: 70,
                    padding: '12px 0',
                    borderRadius: 0,
                    border: selectedSize === size ? '2px solid #111' : '1.5px solid #ddd',
                    background: selectedSize === size ? '#111' : '#fff',
                    color: selectedSize === size ? '#fff' : '#222',
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'background 0.15s, color 0.15s, border 0.15s',
                  }}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 17, fontWeight: 500, margin: '10px 0 8px 0' }}>Quantity</div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 24,
              width: '100%',
            }}>
              <button
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  border: '1.5px solid #ddd',
                  background: '#fff',
                  fontSize: 32, // Make the sign bigger
                  color: '#222',
                  fontWeight: 700,
                  cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                  marginRight: 8,
                  outline: 'none',
                  transition: 'border 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center', // Center the sign
                  padding: 0,
                }}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                –
              </button>
              <span style={{
                width: 38,
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 600,
                color: '#222',
              }}>{quantity}</span>
              <button
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  border: '1.5px solid #ddd',
                  background: '#fff',
                  fontSize: 32, // Make the sign bigger
                  color: '#222',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginLeft: 8,
                  outline: 'none',
                  transition: 'border 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center', // Center the sign
                  padding: 0,
                }}
                onClick={() => setQuantity(q => q + 1)}
              >
                +
              </button>
            </div>
            <button
              style={{
                width: '100%',
                background: '#fff',
                color: '#222',
                border: '1.5px solid #222',
                borderRadius: 8,
                padding: '18px 0',
                fontWeight: 600,
                fontSize: 19,
                cursor: selectedSize ? 'pointer' : 'not-allowed',
                marginBottom: 18,
                transition: 'background 0.2s, color 0.2s, border 0.2s',
              }}
              disabled={!selectedSize}
              onClick={() => {
                if (!selectedProduct || !selectedSize) return;
                const variant = (selectedProduct.variants || []).find(v =>
                  v.title.toUpperCase().includes(selectedSize)
                );
                if (!variant) return;
                addToCart({
                  id: selectedProduct.id,
                  title: selectedProduct.title,
                  price: parseFloat(variant.price),
                  image: selectedProduct.images[0]?.src,
                  variant_title: variant.title,
                  variant_id: variant.id,
                  quantity,
                });
                setShowSizeOverlay(false);
                setShowCartSidebar(true);
                setSelectedProduct(null);
                setSelectedSize('');
                setQuantity(1);
              }}
            >
              Add to cart
            </button>
            <Link
              to={`/product/${selectedProduct.handle}`}
              style={{
                color: '#111',
                fontWeight: 500,
                fontSize: 17,
                textDecoration: 'underline',
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
              onClick={() => {
                setShowSizeOverlay(false);
                setSelectedProduct(null);
                setSelectedSize('');
                setQuantity(1);
              }}
            >
              View full details
              <span style={{ fontSize: 22, marginLeft: 2, display: 'inline-block', transform: 'translateY(2px)' }}>→</span>
            </Link>
          </div>
        </div>
      )}
      <CartSidebar isOpen={showCartSidebar} onClose={() => setShowCartSidebar(false)} />
      <div className="collection-main">
        <aside className="collection-sidebar" ref={sidebarRef}>
          <div className="sidebar-header">
            <h3>Filters</h3>
          </div>
          {/* Selected Filters Bubble Bar */}
          <div style={{ margin: '10px 0', minHeight: 32 }}>
            {Object.entries(selectedFilters).some(([, arr]) => arr.length > 0) && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  alignItems: 'center',
                  minHeight: 32,
                }}
              >
                {Object.entries(selectedFilters).map(([key, arr]) =>
                  arr.map(val => (
                    <div
                      key={key + val}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#fff',
                        border: '1px solid #222',
                        borderRadius: 999,
                        padding: '2px 10px',
                        fontSize: 13,
                        marginBottom: 4,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        color: '#222',
                        fontWeight: 500,
                        height: 28, // fixed height for all bubbles
                        transition: 'background 0.2s, border 0.2s',
                      }}
                    >
                      <span style={{ marginRight: 6 }}>
                        {key === 'discount'
                          ? (discountOptions.find(o => o.value === val)?.label || val)
                          : val}
                      </span>
                      <button
                        aria-label="Remove filter"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          fontSize: 15,
                          marginLeft: 2,
                          color: '#888',
                          lineHeight: 1,
                          width: 18,
                          height: 18,
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onClick={() => handleRemoveFilter(key, val)}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
                {/* Always reserve space for the clear button, but only show it if needed */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                  }}
                >
                  {Object.values(selectedFilters).flat().length > 1 && (
                    <button
                      aria-label="Clear all filters"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: 18,
                        color: '#888',
                        width: 18,
                        height: 18,
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onClick={clearAllFilters}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="filter-group">
            <div className="custom-dropdown-wrap">
              <button
                className={`custom-dropdown-btn${openDropdown === 'gender' ? ' open' : ''}`}
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'gender' ? '' : 'gender')}
              >
                Gender
                <span className={`arrow${openDropdown === 'gender' ? ' up' : ''}`} />
              </button>
              {openDropdown === 'gender' && (
                <ul className="custom-dropdown-list">
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.gender.length === 0}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, gender: [] }))}
                      />
                      All
                      <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                        {filterCounts.gender['']}
                      </span>
                    </label>
                  </li>
                  {genderOptions.map(opt =>
                    filterCounts.gender[opt] > 0 ? (
                      <li key={opt}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedFilters.gender.includes(opt)}
                            onChange={() => handleFilterToggle('gender', opt)}
                          />
                          {opt}
                          <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                            {filterCounts.gender[opt]}
                          </span>
                        </label>
                      </li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
          </div>
          {/* Product Type */}
          <div className="filter-group">
            <div className="custom-dropdown-wrap">
              <button
                className={`custom-dropdown-btn${openDropdown === 'productType' ? ' open' : ''}`}
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'productType' ? '' : 'productType')}
              >
                Product Type
                <span className={`arrow${openDropdown === 'productType' ? ' up' : ''}`} />
              </button>
              {openDropdown === 'productType' && (
                <ul className="custom-dropdown-list">
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.productType.length === 0}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, productType: [] }))}
                      />
                      All
                      <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                        {filterCounts.productType['']}
                      </span>
                    </label>
                  </li>
                  {productTypeOptions.map(opt =>
                    filterCounts.productType[opt] > 0 ? (
                      <li key={opt}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedFilters.productType.includes(opt)}
                            onChange={() => handleFilterToggle('productType', opt)}
                          />
                          {opt}
                          <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                            {filterCounts.productType[opt]}
                          </span>
                        </label>
                      </li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
          </div>
          {/* Collection */}
          <div className="filter-group">
            <div className="custom-dropdown-wrap">
              <button
                className={`custom-dropdown-btn${openDropdown === 'collection' ? ' open' : ''}`}
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'collection' ? '' : 'collection')}
              >
                Collection
                <span className={`arrow${openDropdown === 'collection' ? ' up' : ''}`} />
              </button>
              {openDropdown === 'collection' && (
                <ul className="custom-dropdown-list">
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.collection.length === 0}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, collection: [] }))}
                      />
                      All
                      <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                        {filterCounts.collection['']}
                      </span>
                    </label>
                  </li>
                  {collectionOptions.map(opt =>
                    filterCounts.collection[opt] > 0 ? (
                      <li key={opt}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedFilters.collection.includes(opt)}
                            onChange={() => handleFilterToggle('collection', opt)}
                          />
                          {opt}
                          <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                            {filterCounts.collection[opt]}
                          </span>
                        </label>
                      </li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
          </div>
          {/* Color */}
          <div className="filter-group">
            <div className="custom-dropdown-wrap">
              <button
                className={`custom-dropdown-btn${openDropdown === 'color' ? ' open' : ''}`}
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'color' ? '' : 'color')}
              >
                Color
                <span className={`arrow${openDropdown === 'color' ? ' up' : ''}`} />
              </button>
              {openDropdown === 'color' && (
                <ul className="custom-dropdown-list">
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.color.length === 0}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, color: [] }))}
                      />
                      All
                      <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                        {filterCounts.color['']}
                      </span>
                    </label>
                  </li>
                  {colorOptions.map(opt =>
                    filterCounts.color[opt] > 0 ? (
                      <li key={opt}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedFilters.color.includes(opt)}
                            onChange={() => handleFilterToggle('color', opt)}
                          />
                          {opt}
                          <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                            {filterCounts.color[opt]}
                          </span>
                        </label>
                      </li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
          </div>
          {/* Size */}
          <div className="filter-group">
            <div className="custom-dropdown-wrap">
              <button
                className={`custom-dropdown-btn${openDropdown === 'size' ? ' open' : ''}`}
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'size' ? '' : 'size')}
              >
                Size
                <span className={`arrow${openDropdown === 'size' ? ' up' : ''}`} />
              </button>
              {openDropdown === 'size' && (
                <ul className="custom-dropdown-list">
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.size.length === 0}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, size: [] }))}
                      />
                      All
                      <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                        {filterCounts.size['']}
                      </span>
                    </label>
                  </li>
                  {sizeOptions.map(opt =>
                    filterCounts.size[opt] > 0 ? (
                      <li key={opt}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedFilters.size.includes(opt)}
                            onChange={() => handleFilterToggle('size', opt)}
                          />
                          {opt}
                          <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                            {filterCounts.size[opt]}
                          </span>
                        </label>
                      </li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
          </div>
          {/* Discount */}
          <div className="filter-group">
            <div className="custom-dropdown-wrap">
              <button
                className={`custom-dropdown-btn${openDropdown === 'discount' ? ' open' : ''}`}
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'discount' ? '' : 'discount')}
              >
                Discount
                <span className={`arrow${openDropdown === 'discount' ? ' up' : ''}`} />
              </button>
              {openDropdown === 'discount' && (
                <ul className="custom-dropdown-list">
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.discount.length === 0}
                        onChange={() => setSelectedFilters(prev => ({ ...prev, discount: [] }))}
                      />
                      All
                      <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                        {filterCounts.discount['']}
                      </span>
                    </label>
                  </li>
                  {discountOptions.map(opt =>
                    filterCounts.discount[opt.value] > 0 ? (
                      <li key={opt.value}>
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedFilters.discount.includes(opt.value)}
                            onChange={() => handleFilterToggle('discount', opt.value)}
                          />
                          {opt.label}
                          <span style={{ float: 'right', color: '#888', fontSize: 12 }}>
                            {filterCounts.discount[opt.value]}
                          </span>
                        </label>
                      </li>
                    ) : null
                  )}
                </ul>
              )}
            </div>
          </div>
        </aside>
        <main className="collection-content">
          <div className="collection-header">
            <div className="collection-title-section">
              <h3 className="collection-title">{title}</h3>
            </div>
            <div className="sort-by">
              <label>Sort by: </label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Name: A-Z</option>
                <option value="title-desc">Name: Z-A</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
          <div className="products-grid">
            {products.map(product => (
              <div
                key={product.id}
                className="product-card"
                style={{
                  width: 340,
                  minHeight: 440,
                  background: '#fff',
                  borderRadius: 0,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                  padding: 0,
                  margin: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'box-shadow 0.2s',
                  overflow: 'hidden',
                }}
              >
                <Link
                  to={`/product/${product.handle}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    width: '100%',
                  }}
                >
                  <img
                    className="product-image"
                    src={product.images[0]?.src}
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: 240,
                      objectFit: 'cover',
                      borderRadius: 0,
                      marginBottom: 0,
                      boxShadow: 'none',
                    }}
                  />
                  {/* Optional: Add rating row here if you want */}
                  <div style={{ width: '100%', padding: '18px 20px 0 20px' }}>
                    <h4
                      className="product-title"
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        margin: '0 0 8px 0',
                        textAlign: 'left',
                        minHeight: 44,
                        lineHeight: 1.3,
                      }}
                    >
                      {product.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        className="product-price"
                        style={{
                          fontSize: 17,
                          fontWeight: 600,
                          color: '#222',
                        }}
                      >
                        ₹{parseFloat(product.variants[0]?.price || product.price).toLocaleString()}
                      </span>
                      {product.variants[0]?.compare_at_price &&
                        parseFloat(product.variants[0].compare_at_price) > parseFloat(product.variants[0].price) && (
                          <span
                            className="product-compare"
                            style={{
                              textDecoration: 'line-through',
                              color: '#888',
                              fontSize: 15,
                            }}
                          >
                            ₹{parseFloat(product.variants[0].compare_at_price).toLocaleString()}
                          </span>
                        )}
                      {product.variants[0]?.compare_at_price &&
                        parseFloat(product.variants[0].compare_at_price) > parseFloat(product.variants[0].price) && (
                          <span
                            className="product-discount"
                            style={{
                              color: '#3a9c3a',
                              fontWeight: 700,
                              fontSize: 15,
                              marginLeft: 4,
                            }}
                          >
                            {Math.round(
                              ((parseFloat(product.variants[0].compare_at_price) -
                                parseFloat(product.variants[0].price)) /
                                parseFloat(product.variants[0].compare_at_price)) *
                                100
                            )}
                            % OFF
                          </span>
                        )}
                    </div>
                  </div>
                </Link>
                <div
                  style={{
                    width: '100%',
                    background: '#faf6ef',
                    borderTop: '1px solid #f0e7d8',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 0,
                    margin: '18px 0 0 0',
                  }}
                >
                  <button
                    className="add-to-cart-btn"
                    style={{
                      width: '92%',
                      background: '#fff7e6',
                      color: '#b9976f',
                      border: '1.5px solid #b9976f',
                      borderRadius: 0,
                      padding: '15px 0',
                      margin: '14px 0',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 17,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      letterSpacing: 0.5,
                      boxShadow: '0 1px 4px rgba(185,151,111,0.07)',
                      transition: 'background 0.2s, color 0.2s, border 0.2s',
                    }}
                    onClick={() => handleAddToCartClick(product)}
                    // Always allow click to open size overlay
                  >
                    <svg
                      width="22"
                      height="22"
                      fill="none"
                      stroke="#b9976f"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: 8 }}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
            {hasMore && (
              <div ref={sentinelRef} style={{ height: 1 }} />
            )}
            {loading && <div className="loading-indicator">Loading...</div>}
          </div>
        </main>
      </div>
    </>
  );
}


export default Collections;