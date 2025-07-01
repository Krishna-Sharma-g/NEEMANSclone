import React, { useRef } from 'react';
import './VideoSlider.css';

const videos = [
  {
    url: 'https://cdn.shopify.com/videos/c/vp/3d95c2163e4b4c31850fe708dc0ee2a7/3d95c2163e4b4c31850fe708dc0ee2a7.HD-1080p-2.5Mbps-28939349.mp4#t=0.1',
  },
  {
    url: 'https://cdn.shopify.com/videos/c/vp/2f370722f4b74d2a8974f97fa22f9c28/2f370722f4b74d2a8974f97fa22f9c28.HD-1080p-2.5Mbps-28939360.mp4#t=0.1',
  },
  {
    url: 'https://cdn.shopify.com/videos/c/vp/e9a79fda28a2477fab943c01784152b9/e9a79fda28a2477fab943c01784152b9.HD-1080p-2.5Mbps-28939370.mp4#t=0.1',
  },
  {
    url: 'https://cdn.shopify.com/videos/c/vp/6d853c4694bc485a9106d77bc8088a67/6d853c4694bc485a9106d77bc8088a67.HD-1080p-2.5Mbps-28939387.mp4#t=0.1',
  },
  {
    url: 'https://cdn.shopify.com/videos/c/vp/1e8d0191623e4264ae9503d300b0e5ca/1e8d0191623e4264ae9503d300b0e5ca.HD-1080p-2.5Mbps-28939399.mp4#t=0.1',
  },
   {
    url: 'https://cdn.shopify.com/videos/c/vp/de8e6ffb59df4abd9e7a63941f7f8198/de8e6ffb59df4abd9e7a63941f7f8198.HD-1080p-2.5Mbps-26930307.mp4#t=0.1',
  },
   {
    url: 'https://cdn.shopify.com/videos/c/vp/7c1ccdb6d5b248e58055b4f8a3db0235/7c1ccdb6d5b248e58055b4f8a3db0235.HD-720p-1.6Mbps-26930323.mp4#t=0.1',
  },
   {
    url: 'https://cdn.shopify.com/videos/c/vp/f710d60bf1c3438489562776a0a9b73f/f710d60bf1c3438489562776a0a9b73f.HD-1080p-2.5Mbps-26930338.mp4#t=0.1',
  },
];

const isVideoFile = (url) => url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');

const VideoSlider = () => {
  const scrollRef = useRef();
  const videoRefs = useRef([]);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = current.offsetWidth * 0.7;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseEnter = (idx) => {
    const video = videoRefs.current[idx];
    if (video) {
      video.play();
    }
  };

  const handleMouseLeave = (idx) => {
    const video = videoRefs.current[idx];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div className="video-slider-section">
      <button className="video-arrow left" onClick={() => scroll('left')}>&#10094;</button>
      <div className="video-slider-horizontal" ref={scrollRef}>
        {videos.map((video, idx) => (
          <div className="video-card" key={idx}>
            {isVideoFile(video.url) ? (
              <video
                ref={el => videoRefs.current[idx] = el}
                src={video.url}
                className="video-slide-el"
                poster={video.poster || ''}
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                preload="none"
                muted
                playsInline
                controls={false}
              />
            ) : (
              <iframe
                src={video.url}
                title={`Video ${idx + 1}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-slide-el"
              ></iframe>
            )}
          </div>
        ))}
      </div>
      <button className="video-arrow right" onClick={() => scroll('right')}>&#10095;</button>
    </div>
  );
};

export default VideoSlider; 