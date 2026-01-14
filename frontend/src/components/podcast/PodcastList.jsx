
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      const response = await axios.get('/api/podcasts');
      setPodcasts(response.data);
    };
    fetchPodcasts();
  }, []);

  return (
    <div>
      <h2>Podcasts</h2>
      <ul>
        {podcasts.map((podcast) => (
          <li key={podcast.id}>{podcast.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default PodcastList;
