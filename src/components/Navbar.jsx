import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';

const menuData = {
  MEN: [
    { title: 'SNEAKERS', handle: 'men-sneakers', links: [
      { label: 'CASUAL', handle: 'men-casual' },
      { label: 'CHUNKY', handle: 'men-chunky' },
      { label: 'FORMAL', handle: 'men-formal' },
      { label: 'RETRO', handle: 'men-retro' },
      { label: 'SIGNATURE', handle: 'men-signature' },
      { label: 'SPORTS', handle: 'men-sports' },
      { label: 'WALKING', handle: 'men-walking' },
    ]},
    { title: 'SLIP ONS', handle: 'men-slip-ons', links: ['CASUAL', 'CHUNKY', 'FORMAL', 'SIGNATURE', 'SPORTS', 'WALKING'] },
    { title: 'LOAFERS & OXFORDS', handle: 'men-loafers-oxfords', links: ['CASUAL', 'FORMAL'] },
    { title: 'SLIDES & SANDALS', handle: 'men-slides-sandals', links: ['DAILY USE', 'OUTDOOR', 'EXTRA SOFT', 'TRENDY'] },
    { title: 'FLIP FLOPS', handle: 'men-flip-flops', links: ['DAILY USE', 'EXTRA SOFT', 'TRENDY'] },
    { title: 'CLOGS', handle: 'men-cogs', links: ['OUTDOOR'] },
  ],
  WOMEN: [
    { title: 'SNEAKERS', handle: 'women-sneakers', links: ['CASUAL', 'CHUNKY', 'FORMAL', 'RETRO'] },
    { title: 'SLIP ONS', handle: 'women-slip-ons', links: ['CASUAL', 'CHUNKY', 'FORMAL'] },
    { title: 'LOAFERS & OXFORDS', handle: 'women-loafers-oxfords', links: ['CASUAL', 'FORMAL'] },
    { title: 'FLATS', handle: 'women-flats', links: ['DAILY USE', 'OUTDOOR'] },
  ],
};

const navLinks = [
  { label: 'NEW', to: '#' },
  { label: 'MEN', to: '/collections/men' },
  { label: 'WOMEN', to: '/collections/women' },
  { label: 'ABOUT US', to: '#' },
  { label: 'OFFERS', to: '#' },
];

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { getCartItemsCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (currentScrollY / (documentHeight - windowHeight)) * 100;

      // Make navbar sticky after scrolling 100px
      const shouldBeSticky = currentScrollY > 100;
      setIsSticky(shouldBeSticky);
      
      // Add/remove body class for spacing
      if (shouldBeSticky) {
        document.body.classList.add('navbar-sticky');
      } else {
        document.body.classList.remove('navbar-sticky');
      }

      // Start fading out after 50% scroll
      if (scrollPercentage > 50) {
        const fadePercentage = Math.min((scrollPercentage - 50) / 25, 1); // Fade over 25% scroll
        setIsVisible(fadePercentage < 0.8); // Hide completely at 80% fade
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.body.classList.remove('navbar-sticky');
    };
  }, []);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      <header className={`header ${isSticky ? 'sticky' : ''} ${!isVisible ? 'hidden' : ''}`}>
        <div className="top-bar">
          <div className="promo-message">
            <span>BUY 2, GET 7% OFF; BUY 3, GET 10% OFF</span>
          </div>
          <div className="top-bar-links">
            <span>STUDENT DISCOUNT</span>
            <span>TRACK YOUR ORDER</span>
            <span>HELP</span>
          </div>
        </div>
        <div className="main-nav-container" onMouseLeave={() => setActiveMenu(null)}>
          <div className="main-nav">
            <div className="logo">
              <img src="assets/logoimage.png" alt="NEEMAN'S" />
            </div>
            <nav className="nav-links">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="nav-item"
                  onMouseEnter={() => setActiveMenu(link.label)}
                >
                  {link.to.startsWith('/collections/') ? (
                    <Link to={link.to}>{link.label}</Link>
                  ) : (
                    <a href={link.to}>{link.label}</a>
                  )}
                </div>
              ))}
            </nav>
            <div className="nav-actions">
              <a href="#">SEARCH</a>
              <a href="#">FIND STORES</a>
              <a href="#">LOGIN</a>
              <button onClick={toggleCart} className="cart-button">
                CART
                {getCartItemsCount() > 0 && (
                  <span className="cart-count">{getCartItemsCount()}</span>
                )}
              </button>
            </div>
          </div>
          {activeMenu && menuData[activeMenu] && (
            <div className="mega-menu">
              <div className="mega-menu-content">
                {menuData[activeMenu].map((column) => {
                  const columnHandle = column.handle || column.title.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <div key={column.title} className="mega-menu-column">
                      <Link
                        to={`/collections/${columnHandle}`}
                        className="mega-menu-title"
                        onClick={() => setActiveMenu(null)}
                      >
                        {column.title} &rarr;
                      </Link>
                      <ul>
                        {column.links.map((link) => {
                          // link can be a string or an object with label/handle
                          let linkLabel, linkHandle;
                          if (typeof link === 'string') {
                            linkLabel = link;
                            linkHandle = link.toLowerCase().replace(/\s+/g, '-');
                          } else {
                            linkLabel = link.label;
                            linkHandle = link.handle || link.label.toLowerCase().replace(/\s+/g, '-');
                          }
                          return (
                            <li key={linkLabel}>
                              <Link
                                to={`/collections/${linkHandle}`}
                                onClick={() => setActiveMenu(null)}
                              >
                                {linkLabel}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>
      
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;
