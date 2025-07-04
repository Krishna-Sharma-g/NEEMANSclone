import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useCart } from '../context/CartContext';
import CartSidebar from './CartSidebar';
import logoimage from '/assets/logoimage.png'; // Adjust the path as necessary

const menuData = {
  MEN: [
    {
      title: 'SNEAKERS',
      handle: 'sneakers-for-men',
      links: [
        { label: 'CASUAL', handle: 'casual-sneakers-for-men' },
        { label: 'CHUNKY', handle: 'chunky-sneakers-for-men' },
        { label: 'FORMAL', handle: 'formal-sneakers-for-men' },
        { label: 'RETRO', handle: 'retro-sneakers-for-men' },
        { label: 'SIGNATURE', handle: 'signature-sneakers-for-men' },
        { label: 'SPORTS', handle: 'sports-sneakers-for-men' },
        { label: 'WALKING', handle: 'walking-sneakers-for-men' },
      ],
    },
    {
      title: 'SLIP ONS',
      handle: 'slip-ons-for-men',
      links: [
        { label: 'CASUAL', handle: 'casual-slip-ons-for-men' },
        { label: 'CHUNKY', handle: 'chunky-slip-ons-for-men' },
        { label: 'FORMAL', handle: 'formal-slip-ons-for-men' },
        { label: 'SIGNATURE', handle: 'signature-slip-ons-for-men' },
        { label: 'SPORTS', handle: 'sports-slip-ons-for-men' },
        { label: 'WALKING', handle: 'walking-slip-ons-for-men' },
      ],
    },
    {
      title: 'LOAFERS & OXFORDS',
      handle: 'loafers-oxfords-for-men',
      links: [
        { label: 'CASUAL', handle: 'casual-loafers-oxfords-for-men' },
        { label: 'FORMAL', handle: 'formal-loafers-oxfords-for-men' },
      ],
    },
    {
      title: 'SLIDES & SANDALS',
      handle: 'slides-sandals-for-men',
      links: [
        { label: 'DAILY USE', handle: 'daily-use-slides-sandals-for-men' },
        { label: 'OUTDOOR', handle: 'outdoor-slides-sandals-for-men' },
        { label: 'EXTRA SOFT', handle: 'extra-soft-slides-sandals-for-men' },
        { label: 'TRENDY', handle: 'trendy-slides-sandals-for-men' },
      ],
    },
    {
      title: 'FLIP FLOPS',
      handle: 'flip-flops-for-men',
      links: [
        { label: 'DAILY USE', handle: 'daily-use-flip-flops-for-men' },
        { label: 'EXTRA SOFT', handle: 'extra-soft-flip-flops-for-men' },
        { label: 'TRENDY', handle: 'trendy-flip-flops-for-men' },
      ],
    },
    {
      title: 'CLOGS',
      handle: 'clogs-for-men',
      links: [
        { label: 'OUTDOOR', handle: 'outdoor-clogs-for-men' },
      ],
    },
  ],
  WOMEN: [
    {
      title: 'SNEAKERS',
      handle: 'sneakers-for-women',
      links: [
        { label: 'CASUAL', handle: 'casual-sneakers-for-women' },
        { label: 'CHUNKY', handle: 'chunky-sneakers-for-women' },
        { label: 'FORMAL', handle: 'formal-sneakers-for-women' },
        { label: 'RETRO', handle: 'retro-sneakers-for-women' },
      ],
    },
    {
      title: 'SLIP ONS',
      handle: 'slip-ons-for-women',
      links: [
        { label: 'CASUAL', handle: 'casual-slip-ons-for-women' },
        { label: 'CHUNKY', handle: 'chunky-slip-ons-for-women' },
        { label: 'FORMAL', handle: 'formal-slip-ons-for-women' },
      ],
    },
    {
      title: 'LOAFERS & OXFORDS',
      handle: 'loafers-oxfords-for-women',
      links: [
        { label: 'CASUAL', handle: 'casual-loafers-oxfords-for-women' },
        { label: 'FORMAL', handle: 'formal-loafers-oxfords-for-women' },
      ],
    },
    {
      title: 'FLATS',
      handle: 'flats-for-women',
      links: [
        { label: 'DAILY USE', handle: 'daily-use-flats-for-women' },
        { label: 'OUTDOOR', handle: 'outdoor-flats-for-women' },
      ],
    },
  ],
};


const navLinks = [
  { label: 'NEW', to: '#', dropdown: true },
  { label: 'MEN', to: '/collections/men', dropdown: true },
  { label: 'WOMEN', to: '/collections/women', dropdown: true },
  { label: 'ABOUT US', to: '#', dropdown: true },
  { label: 'OFFERS', to: '#', dropdown: true },
];

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { getCartItemsCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Track hover state for nav and mega menu
  const [navHover, setNavHover] = useState(false);
  const [megaMenuHover, setMegaMenuHover] = useState(false);

  // Timer for delayed closing of mega menu
  const closeMenuTimeout = useRef(null);

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

  // Handle hover logic for dropdown
  useEffect(() => {
    // If neither nav nor mega menu is hovered, close the menu after a short delay
    if (!navHover && !megaMenuHover) {
      closeMenuTimeout.current = setTimeout(() => setActiveMenu(null), 120);
    } else {
      clearTimeout(closeMenuTimeout.current);
    }
    return () => clearTimeout(closeMenuTimeout.current);
  }, [navHover, megaMenuHover]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Close sidebar on route change or overlay click
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [sidebarOpen]);

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
        <div className="main-nav-container">
          <div className="main-nav">
            {/* Hamburger for mobile */}
            <button
              className="hamburger-menu"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
            {/* Centered logo */}
            <div className="logo">
              <Link to="/">
                <img src= {logoimage} alt="NEEMAN'S" />
              </Link>
            </div>
            {/* Desktop nav links */}
            <nav className="nav-links">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="nav-item"
                  onMouseEnter={() => {
                    setActiveMenu(link.label);
                    setNavHover(true);
                  }}
                  onMouseLeave={() => setNavHover(false)}
                >
                  {link.to.startsWith('/collections/') ? (
                    <Link to={link.to}>{link.label}</Link>
                  ) : (
                    <a href={link.to}>{link.label}</a>
                  )}
                  {link.dropdown && <span className="down-arrow">▼</span>}
                </div>
              ))}
            </nav>
            {/* Cart and nav-actions always at right */}
            <div className="nav-actions">
              <a className="nav-action" href="#">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                SEARCH
              </a>
              <a className="nav-action" href="#">
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10.5V21H3v-10.5l9-7 9 7z"/><path d="M9 21V12h6v9"/></svg>
                FIND STORES
              </a>
              <a className="nav-action" href="#">
                <svg width="22" height="22" fill="none" stroke="#b9976f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M16 16v-1a4 4 0 0 0-8 0v1"/></svg>
                LOGIN
              </a>
              <button onClick={toggleCart} className="cart-button nav-action">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                CART
                <span className="cart-count">{getCartItemsCount()}</span>
              </button>
            </div>
          </div>
          {/* Mega menu for desktop */}
          {activeMenu && menuData[activeMenu] && (
            <div
              className="mega-menu"
              onMouseEnter={() => setMegaMenuHover(true)}
              onMouseLeave={() => setMegaMenuHover(false)}
              style={{ pointerEvents: 'auto' }}
            >
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
                          let linkLabel, linkHandle;
                          if (typeof link === 'object' && link.handle) {
                            linkLabel = link.label;
                            linkHandle = link.handle;
                          } else if (typeof link === 'string') {
                            linkLabel = link;
                            linkHandle = link.toLowerCase().replace(/\s+/g, '-');
                          } else {
                            linkLabel = String(link);
                            linkHandle = String(link).toLowerCase().replace(/\s+/g, '-');
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
        {/* Sidebar overlay and sidebar */}
        <div className={`navbar-sidebar-overlay${sidebarOpen ? ' open' : ''}`} onClick={() => setSidebarOpen(false)} />
        <aside className={`navbar-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="sidebar-header">
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>&times;</button>
            <div className="sidebar-logo">
              <Link to="/" onClick={() => setSidebarOpen(false)}>
                <img src="/assets/logoimage.png" alt="NEEMAN'S" />
              </Link>
            </div>
          </div>
          <nav className="sidebar-links">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="sidebar-nav-item"
                onClick={() => setSidebarOpen(false)}
              >
                {link.to.startsWith('/collections/') ? (
                  <Link to={link.to}>{link.label}</Link>
                ) : (
                  <a href={link.to}>{link.label}</a>
                )}
              </div>
            ))}
          </nav>
          <div className="sidebar-actions">
            <a className="nav-action" href="#">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              SEARCH
            </a>
            <a className="nav-action" href="#">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10.5V21H3v-10.5l9-7 9 7z"/><path d="M9 21V12h6v9"/></svg>
              FIND STORES
            </a>
            <a className="nav-action" href="#">
              <svg width="22" height="22" fill="none" stroke="#b9976f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M16 16v-1a4 4 0 0 0-8 0v1"/></svg>
              LOGIN
            </a>
            <button onClick={() => { toggleCart(); setSidebarOpen(false); }} className="cart-button nav-action">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              CART
              <span className="cart-count">{getCartItemsCount()}</span>
            </button>
          </div>
        </aside>
      </header>
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};


export default Navbar;
