// src/components/SpotifyPlayer.jsx
import React from 'react';

const SpotifyPlayer = ({ trackId }) => {
  if (!trackId) return null;

  return (
    <div className="spotify-player-container" style={{ marginTop: '20px' }}>
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ borderRadius: '12px' }}
      ></iframe>
    </div>
  );
};

export default SpotifyPlayer;