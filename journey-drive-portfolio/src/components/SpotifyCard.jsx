// frontend/src/components/SpotifyCard.jsx
import React, { useEffect, useState } from 'react';
import { fetchTrackData } from '../api';

const SpotifyCard = ({ trackId }) => {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    fetchTrackData(trackId).then(setTrack);
  }, [trackId]);

  if (!track) return <div>Loading track...</div>;

  return (
    <div style={cardStyle}>
      <img src={track.album.images[0].url} alt={track.name} style={imgStyle} />
      <div style={infoStyle}>
        <h3>{track.name}</h3>
        <p>{track.artists.map(a => a.name).join(', ')}</p>
        <a href={track.external_urls.spotify} target="_blank" rel="noreferrer">
          Listen on Spotify
        </a>
      </div>
    </div>
  );
};

// Simple styles
const cardStyle = { display: 'flex', gap: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '12px', background: '#191414', color: 'white' };
const imgStyle = { width: '120px', height: '120px', borderRadius: '8px' };
const infoStyle = { display: 'flex', flexDirection: 'column', justifyContent: 'center' };

export default SpotifyCard;