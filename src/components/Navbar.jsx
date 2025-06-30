import React, { useState } from 'react';
import './Navbar.css';

const menuData = {
  MEN: [
    { title: 'SNEAKERS', href: '#', links: ['CASUAL', 'CHUNKY', 'FORMAL', 'RETRO', 'SIGNATURE', 'SPORTS', 'WALKING'] },
    { title: 'SLIP ONS', href: '#', links: ['CASUAL', 'CHUNKY', 'FORMAL', 'SIGNATURE', 'SPORTS', 'WALKING'] },
    { title: 'LOAFERS & OXFORDS', href: '#', links: ['CASUAL', 'FORMAL'] },
    { title: 'SLIDES & SANDALS', href: '#', links: ['DAILY USE', 'OUTDOOR', 'EXTRA SOFT', 'TRENDY'] },
    { title: 'FLIP FLOPS', href: '#', links: ['DAILY USE', 'EXTRA SOFT', 'TRENDY'] },
    { title: 'CLOGS', href: '#', links: ['OUTDOOR'] },
  ],
  WOMEN: [ // Example data
    { title: 'SNEAKERS', href: '#', links: ['CASUAL', 'CHUNKY', 'FORMAL', 'RETRO'] },
    { title: 'SLIP ONS', href: '#', links: ['CASUAL', 'CHUNKY', 'FORMAL'] },
    { title: 'LOAFERS & OXFORDS', href: '#', links: ['CASUAL', 'FORMAL'] },
    { title: 'FLATS', href: '#', links: ['DAILY USE', 'OUTDOOR'] },
  ],
};

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const navLinks = ['NEW', 'MEN', 'WOMEN', 'ABOUT US', 'OFFERS'];

  return (
    <header className="header">
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
                key={link}
                className="nav-item"
                onMouseEnter={() => setActiveMenu(link)}
              >
                <a href="#">{link}</a>
              </div>
            ))}
          </nav>
          <div className="nav-actions">
            <a href="#">SEARCH</a>
            <a href="#">FIND STORES</a>
            <a href="#">LOGIN</a>
            <a href="#">CART</a>
          </div>
        </div>
        {activeMenu && menuData[activeMenu] && (
          <div className="mega-menu">
            <div className="mega-menu-content">
              {menuData[activeMenu].map((column) => (
                <div key={column.title} className="mega-menu-column">
                  <a href={column.href} className="mega-menu-title">{column.title} &rarr;</a>
                  <ul>
                    {column.links.map((link) => (
                      <li key={link}><a href="#">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
