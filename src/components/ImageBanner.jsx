import React from 'react';
import './ImageBanner.css';

const ImageBanner = ({ imageUrl, alt = "Banner", style = {} }) => {
  return (
    <div className="image-banner" style={style}>
      <img src={imageUrl} alt={alt} />
    </div>
  );
};

export default ImageBanner;