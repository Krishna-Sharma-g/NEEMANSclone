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
import ReviewimageSlider from './components/reviewimageslider';
import BestSeller from './components/BestSeller';
import VideoSlider from './components/VideoSlider';
import CollectionPage from './pages/CollectionPage';

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
      <ReviewimageSlider />
      <BestSeller />
      <VideoSlider />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/collections/:handle" element={<CollectionPage />} />
    </Routes>
  );
}

export default App;
