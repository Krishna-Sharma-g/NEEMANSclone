import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Slider from './components/Slider';
import ImageBanner from './components/ImageBanner';
import CategoryCards from './components/CategoryCards';
import CollectionCards from './components/CollectionCards';
import ProductSlider from './components/ProductSlider';
import ReviewSlider from './components/ReviewSlider';
import TrendingSlider from './components/TrendingSlider';
import ReviewImageSlider from './components/reviewimageslider';
import BestSeller from './components/BestSeller';
import VideoSlider from './components/VideoSlider';
import CollectionPage from './pages/CollectionPage';
import ProductView from './pages/ProductView';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';
import FooterBanner from './components/FooterBanner';

function HomePage() {
  return (
    <div className="App">
      <Navbar />
      <Slider />
      <ImageBanner />
      <CollectionCards />
      <ProductSlider />
      <CategoryCards />
      <TrendingSlider />
      <ReviewSlider />
      <ReviewImageSlider />
      <BestSeller />
      <VideoSlider />
      <FooterBanner />
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
