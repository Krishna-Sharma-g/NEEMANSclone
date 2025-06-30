import React from 'react';
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

function App() {
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

export default App;
