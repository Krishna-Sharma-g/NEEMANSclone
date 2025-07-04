import React from 'react';
import './StoryView.css';

const StoryView = ({ videoUrl, imageUrl, title, description, quote }) => {
  return (
    <section className="storyview-section">
      <div className="storyview-media">
        <video
          src={videoUrl}
          className="storyview-video"
          autoPlay
          muted
          loop
          playsInline
          controls
          poster={imageUrl}
        />
      </div>
      <div className="storyview-content">
        {imageUrl && <img src={imageUrl} alt={title} className="storyview-image" />}
        {/* <h2 className="storyview-title">{title}</h2>
        <p className="storyview-description">{description}</p>
        {quote && <blockquote className="storyview-quote">{quote}</blockquote>} */}
      </div>
    </section>
  );
};

export default StoryView; 