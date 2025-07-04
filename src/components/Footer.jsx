import React from 'react';
import './Footer.css';
import { useNavigate } from 'react-router-dom';

const collectionHandles = {
  // SHOP BY STYLE
  'Sports shoes': 'sports-shoes',
  'Formal shoes': 'formal-shoes',
  'Walking shoes': 'walking-shoes',
  'Running shoes': 'running-shoes',
  'Flats for women': 'flats-for-women',
  'Casual shoes': 'casual-shoes',
  'Sneakers shoes': 'sneakers-shoes',
  'Trending shoes': 'trending-shoes',
  'Boots shoes': 'boots-shoes',
  'Leather shoes': 'leather-shoes',
  'Kurty shoes': 'kurty-shoes',
  // SIGNATURE COLLECTION
  'Signature sneakers for men': 'signature-sneakers-for-men',
  'Slides sneakers': 'slides-sneakers',
  'Chunky sneakers for men': 'chunky-sneakers-for-men',
  'Chunky sneakers for women': 'chunky-sneakers-for-women',
  'Casual sneakers for men': 'casual-sneakers-for-men',
  'Formal sneakers for men': 'formal-sneakers-for-men',
  // FLIP FLOPS COLLECTION
  'Flip flops': 'flip-flops',
  'Big Recycle for women': 'big-recycle-for-women',
  'Extra soft flip flops for women': 'extra-soft-flip-flops-for-women',
  'Big Recycle for men': 'big-recycle-for-men',
  'Extra soft flip flops for men': 'extra-soft-flip-flops-for-men',
  'Daily slip flip flops for men': 'daily-slip-flip-flops-for-men',
  // SHOES COLLECTION
  'Shoes': 'shoes',
  'Men': 'men',
  'Women': 'women',
  'All products': 'all-products',
  'Men shoes': 'men-shoes',
  'Women shoes': 'women-shoes',
  // LOAFERS AND OXFORDS COLLECTION
  'Loafers': 'loafers',
  'Oxfords': 'oxfords',
  'Formal loafers/oxfords for men': 'formal-loafers-oxfords-for-men',
  'Leather oxfords for men': 'leather-oxfords-for-men',
  'Casual loafers/oxfords for men': 'casual-loafers-oxfords-for-men',
  'Heavy back loafers and oxfords': 'heavy-back-loafers-oxfords',
  // SLIPPERS COLLECTION
  'Slippers': 'slippers',
  'Chappal': 'chappal',
  'Mens slippers': 'mens-slippers',
  'Womens slippers': 'womens-slippers',
  'Stylish slippers for women': 'stylish-slippers-for-women',
  'Best slippers for women': 'best-slippers-for-women',
  'Black slippers': 'black-slippers',
  'White slippers': 'white-slippers',
  // SANDALS COLLECTION
  'Sandals': 'sandals',
  'Sandals for men': 'sandals-for-men',
  'Extra comfortable for men': 'extra-comfortable-for-men',
  'Extra comfortable for women': 'extra-comfortable-for-women',
  'Sandals for women': 'sandals-for-women',
  'Daily use for men': 'daily-use-for-men',
  'Girls sandals': 'girls-sandals',
  'Ladies sandals': 'ladies-sandals',
  'Trendy sandals for men': 'trendy-sandals-for-men',
  // SLIP ONS COLLECTION
  'Slip Ons': 'slip-ons',
  'Formal slip ons for men': 'formal-slip-ons-for-men',
  'Slip ons for women': 'slip-ons-for-women',
  'Casual slip ons for women': 'casual-slip-ons-for-women',
  'New launched slip ons': 'new-launched-slip-ons',
  'Walking slip ons for men': 'walking-slip-ons-for-men',
  'Chunky slip ons for men': 'chunky-slip-ons-for-men',
  // SLIDES COLLECTION
  'Slides': 'slides',
  'Men slides': 'men-slides',
  'Best slides for men': 'best-slides-for-men',
  'Best slides for women': 'best-slides-for-women',
  'Women slides': 'women-slides',
  // CLOGS COLLECTION
  'Newly launched Clogs': 'newly-launched-clogs',
  'Clogs for Men': 'clogs-for-men',
  'Clogs for Women': 'clogs-for-women',
  'Outdoor Clogs for Men': 'outdoor-clogs-for-men',
  'Outdoor Clogs for Women': 'outdoor-clogs-for-women',
};

const Footer = () => {
  const navigate = useNavigate();

  const handleCollectionClick = (handle) => {
    if (handle) {
      navigate(`/collections/${handle}`);
    }
  };

  // Helper to render a list with navigation if handle exists
  const renderList = (items) => (
    <ul>
      {items.map((item) => (
        collectionHandles[item] ? (
          <li key={item} style={{cursor: 'pointer', color: '#b9976f'}} onClick={() => handleCollectionClick(collectionHandles[item])}>{item}</li>
        ) : (
          <li key={item}>{item}</li>
        )
      ))}
    </ul>
  );

  return (
    <footer className="footer-container">
      <div className="footer-top">
        <img src="https://neemans.com/cdn/shop/files/Relive_knit_bottle.png?v=1737457911&width=220" alt="Recycled Bottle" className="footer-bottle" />
        <h2>Our page has come to an end, but our relationship with you has not.</h2>
        <p>Stay sustainable and subscribe now</p>
        <form className="footer-subscribe">
          <input type="email" placeholder="Enter your email address" />
          <button type="submit">SUBSCRIBE</button>
        </form>
      </div>
      <div className="footer-links-grid">
        <div>
          <h4>SHOP BY STYLE</h4>
          {renderList([
            'Sports shoes', 'Formal shoes', 'Walking shoes', 'Running shoes', 'Flats for women', 'Casual shoes', 'Sneakers shoes', 'Trending shoes', 'Boots shoes', 'Leather shoes', 'Kurty shoes',
          ])}
        </div>
        <div>
          <h4>INFORMATION</h4>
          {renderList([
            'Track Your Order', 'Contact us', 'Brand Impact', 'Why Neemans?', 'Student Discount', 'Press', 'Bulk Inquiry', 'Blog', 'FAQ',
          ])}
        </div>
        <div>
          <h4>GUIDES</h4>
          {renderList([
            'Schedule a Return / Exchange', 'Size Chart', 'Return Policy', 'Privacy Policy', 'Cookie Policy', 'Terms & Conditions',
          ])}
        </div>
        <div>
          <h4>SIGNATURE COLLECTION</h4>
          {renderList([
            'Signature sneakers for men', 'Slides sneakers', 'Chunky sneakers for men', 'Chunky sneakers for women', 'Casual sneakers for men', 'Formal sneakers for men',
          ])}
        </div>
        <div>
          <h4>FLIP FLOPS COLLECTION</h4>
          {renderList([
            'Flip flops', 'Big Recycle for women', 'Extra soft flip flops for women', 'Big Recycle for men', 'Extra soft flip flops for men', 'Daily slip flip flops for men',
          ])}
        </div>
        <div>
          <h4>SHOES COLLECTION</h4>
          {renderList([
            'Shoes', 'Men', 'Women', 'All products', 'Men shoes', 'Women shoes',
          ])}
        </div>
        <div>
          <h4>LOAFERS AND OXFORDS COLLECTION</h4>
          {renderList([
            'Loafers', 'Oxfords', 'Formal loafers/oxfords for men', 'Leather oxfords for men', 'Casual loafers/oxfords for men', 'Heavy back loafers and oxfords',
          ])}
        </div>
        <div>
          <h4>SLIPPERS COLLECTION</h4>
          {renderList([
            'Slippers', 'Chappal', 'Mens slippers', 'Womens slippers', 'Stylish slippers for women', 'Best slippers for women', 'Black slippers', 'White slippers',
          ])}
        </div>
        <div>
          <h4>SANDALS COLLECTION</h4>
          {renderList([
            'Sandals', 'Sandals for men', 'Extra comfortable for men', 'Extra comfortable for women', 'Sandals for women', 'Daily use for men', 'Girls sandals', 'Ladies sandals', 'Trendy sandals for men',
          ])}
        </div>
        <div>
          <h4>SLIP ONS COLLECTION</h4>
          {renderList([
            'Slip Ons', 'Formal slip ons for men', 'Slip ons for women', 'Casual slip ons for women', 'New launched slip ons', 'Walking slip ons for men', 'Slip ons for women', 'Chunky slip ons for men',
          ])}
        </div>
        <div>
          <h4>SLIDES COLLECTION</h4>
          {renderList([
            'Slides', 'Men slides', 'Best slides for men', 'Best slides for women', 'Women slides',
          ])}
        </div>
        <div>
          <h4>CLOGS COLLECTION</h4>
          {renderList([
            'Newly launched Clogs', 'Clogs for Men', 'Clogs for Women', 'Outdoor Clogs for Men', 'Outdoor Clogs for Women',
          ])}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-contact">
          <p>CONTACT US -</p>
          <p>Phone No. : +91-9004-26841</p>
          <p>Timing : Monday to Sunday (7 AM - 7 PM)</p>
        </div>
        <div className="footer-social">
          {/* Social icons can be added here */}
        </div>
        <div className="footer-payment">
            <img src='https://cdn.shopify.com/s/files/1/2428/5565/files/100_Secure_Transaction_Desktop_1.jpg?v=1737029665&width=800' alt="Secure Transaction" />
            </div>
        <div className="footer-copyright">
          <p>© Neemans. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
