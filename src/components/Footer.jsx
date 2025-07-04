import React from 'react';
import './Footer.css';

const Footer = () => {
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
          <ul>
            <li>Sports shoes</li>
            <li>Formal shoes</li>
            <li>Walking shoes</li>
            <li>Running shoes</li>
            <li>Flats for women</li>
            <li>Casual shoes</li>
            <li>Sneakers shoes</li>
            <li>Trending shoes</li>
            <li>Boots shoes</li>
            <li>Leather shoes</li>
            <li>Kurty shoes</li>
          </ul>
        </div>
        <div>
          <h4>INFORMATION</h4>
          <ul>
            <li>Track Your Order</li>
            <li>Contact us</li>
            <li>Brand Impact</li>
            <li>Why Neemans?</li>
            <li>Student Discount</li>
            <li>Press</li>
            <li>Bulk Inquiry</li>
            <li>Blog</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h4>GUIDES</h4>
          <ul>
            <li>Schedule a Return / Exchange</li>
            <li>Size Chart</li>
            <li>Return Policy</li>
            <li>Privacy Policy</li>
            <li>Cookie Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
        <div>
          <h4>SIGNATURE COLLECTION</h4>
          <ul>
            <li>Signature sneakers for men</li>
            <li>Slides sneakers</li>
            <li>Chunky sneakers for men</li>
            <li>Chunky sneakers for women</li>
            <li>Casual sneakers for men</li>
            <li>Formal sneakers for men</li>
          </ul>
        </div>
        <div>
          <h4>FLIP FLOPS COLLECTION</h4>
          <ul>
            <li>Flip flops</li>
            <li>Big Recycle for women</li>
            <li>Extra soft flip flops for women</li>
            <li>Big Recycle for men</li>
            <li>Extra soft flip flops for men</li>
            <li>Daily slip flip flops for men</li>
          </ul>
        </div>
        <div>
          <h4>SHOES COLLECTION</h4>
          <ul>
            <li>Shoes</li>
            <li>Men</li>
            <li>Women</li>
            <li>All products</li>
            <li>Men shoes</li>
            <li>Women shoes</li>
          </ul>
        </div>
        <div>
          <h4>LOAFERS AND OXFORDS COLLECTION</h4>
          <ul>
            <li>Loafers</li>
            <li>Oxfords</li>
            <li>Formal loafers/oxfords for men</li>
            <li>Leather oxfords for men</li>
            <li>Casual loafers/oxfords for men</li>
            <li>Heavy back loafers and oxfords</li>
          </ul>
        </div>
        <div>
          <h4>SLIPPERS COLLECTION</h4>
          <ul>
            <li>Slippers</li>
            <li>Chappal</li>
            <li>Mens slippers</li>
            <li>Womens slippers</li>
            <li>Stylish slippers for women</li>
            <li>Best slippers for women</li>
            <li>Black slippers</li>
            <li>White slippers</li>
          </ul>
        </div>
        <div>
          <h4>SANDALS COLLECTION</h4>
          <ul>
            <li>Sandals</li>
            <li>Sandals for men</li>
            <li>Extra comfortable for men</li>
            <li>Extra comfortable for women</li>
            <li>Sandals for women</li>
            <li>Daily use for men</li>
            <li>Girls sandals</li>
            <li>Ladies sandals</li>
            <li>Trendy sandals for men</li>
          </ul>
        </div>
        <div>
          <h4>SLIP ONS COLLECTION</h4>
          <ul>
            <li>Slip Ons</li>
            <li>Formal slip ons for men</li>
            <li>Slip ons for women</li>
            <li>Casual slip ons for women</li>
            <li>New launched slip ons</li>
            <li>Walking slip ons for men</li>
            <li>Slip ons for women</li>
            <li>Chunky slip ons for men</li>
          </ul>
        </div>
        <div>
          <h4>SLIDES COLLECTION</h4>
          <ul>
            <li>Slides</li>
            <li>Men slides</li>
            <li>Best slides for men</li>
            <li>Best slides for women</li>
            <li>Women slides</li>
          </ul>
        </div>
        <div>
          <h4>CLOGS COLLECTION</h4>
          <ul>
            <li>Newly launched Clogs</li>
            <li>Clogs for Men</li>
            <li>Clogs for Women</li>
            <li>Outdoor Clogs for Men</li>
            <li>Outdoor Clogs for Women</li>
          </ul>
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
            <img src='https://cdn.shopify.com/s/files/1/2428/5565/files/100_Secure_Transaction_Mobile_1.jpg?v=1737029665&width=450' alt="Secure Transaction" />
            </div>
        <div className="footer-copyright">
          <p>© Neemans. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
