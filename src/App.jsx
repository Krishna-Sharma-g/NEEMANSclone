import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Slider from './components/Slider';
import ImageBanner from './components/ImageBanner';
import CategoryCards from './components/CategoryCards';
import CollectionCards from './components/CollectionCards';
import ProductSlider from './components/ProductSlider';
import ReviewSlider from './components/ReviewSlider';
// import TrendingSlider from './components/TrendingSlider';
import ReviewImageSlider from './components/reviewimageslider';
// import BestSeller from './components/BestSeller';
import VideoSlider from './components/VideoSlider';
import CollectionPage from './pages/CollectionPage';
import ProductView from './pages/ProductView';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import FooterBanner from './components/FooterBanner';
import image from '/assets/image.png'; // Adjust the path as necessary
import banner2 from '/assets/banner2.png'; // Adjust the path as necessary
import banner3 from '/assets/banner3.png'; // Adjust the path as necessary
import testimonialimage from '/assets/testimonial.png'; // Adjust the path as necessary
import footerbanner from '/assets/footer.png'; // Adjust the path as necessary
import StoryView from './components/StoryView';
import Footer from './components/Footer';
function HomePage() {
  return (
    <div className="App">
      <Navbar />
      <Slider />
<ImageBanner imageUrl= {image} alt="Neeman's Impact" />
      <CollectionCards />
      <ImageBanner imageUrl= {banner2} alt="Neeman's Impact" />

      <ProductSlider
       title="New Launches"
       fetchUrl="https://neemans.com/collections/newest-products/products.json"
       afterImages={[
       "https://neemans.com/cdn/shop/files/Awards_Desktop.jpg?v=1727499800&width=1500",
       "https://neemans.com/cdn/shop/files/Offers_desktop_…241-92bb-ae553479abe5.jpg?v=1739874202&width=1500"
  ]}/>
    <ImageBanner imageUrl= {banner3} alt="Neeman's Impact" />

      <CategoryCards />
      <ProductSlider
      title="Trending"
      fetchUrl="https://neemans.com/collections/trending-products/products.json"
      afterImages={[
      "assets/testimonial.png"
  ]}
/>
      <ImageBanner imageUrl= {testimonialimage} alt="Neeman's Impact" />

      <ReviewSlider />
      <ReviewImageSlider />
      <ProductSlider
      title="Best Seller"
      fetchUrl="https://neemans.com/collections/best-selling-products/products.json"
      afterImages={[
      "https://neemans.com/cdn/shop/files/Desktop_awards_…3ec-bf6a-9a2f34c1c547.jpg?v=1736334654&width=1500",
      "https://neemans.com/cdn/shop/files/Frame_3066.jpg?v=1712584274&width=1500"
  ]}
  />
  <ImageBanner imageUrl= "https://neemans.com/cdn/shop/files/Desktop_awards_cb07f1b0-6f23-43ec-bf6a-9a2f34c1c547.jpg?v=1736334654&width=1500" alt="Neeman's Impact" />

  <ImageBanner imageUrl= "https://neemans.com/cdn/shop/files/Frame_3066.jpg?v=1712584274&width=1500" alt="Neeman's Impact" />
    
      <VideoSlider />
      <ImageBanner imageUrl= {footerbanner} alt="Neeman's Impact" />
      <StoryView
  videoUrl="https://cdn.shopify.com/videos/c/o/v/f629a444b254409ea7c4562746413c1a.mp4"
  imageUrl="https://neemans.com/cdn/shop/files/Videos_text.jpg?v=1712241682&width=550"
  title="Our Story"
  description="We crushed something and it turned into a story we're proud of!"
  quote="Left in the ocean. Recycled into shoes."
/>
<ImageBanner imageUrl= "https://neemans.com/cdn/shop/files/Offline_store.jpg?v=1712241901&width=1500" alt="Neeman's Impact" />
<ImageBanner imageUrl= "https://neemans.com/cdn/shop/files/Bulk_enquires_desktop_9efa04f3-7756-4e75-a8a1-d76c7d4615ec.jpg?v=1712241901&width=1500" alt="Neeman's Impact" />

  <Footer/>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/collections/:handle" element={<CollectionPage />} />
          <Route path="/product/:productHandle" element={<ProductView />} />
        </Routes>
      </div>
    </CartProvider>
  );
}


export default App;
