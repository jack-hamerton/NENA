import React, { useState, useEffect } from 'react';
import podcastService from '../services/podcast.service';

const Podcasts = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    podcastService.getPodcasts().then(response => setPodcasts(response.data));
  }, []);

  return (
    <div>
      <h2>Podcasts</h2>
      {/* Add podcast player and list here */}
    </div>
  );
};

export default Podcasts;
