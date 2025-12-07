import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { Link } from 'react-router-dom';

export const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      const response = await api.get('/podcasts');
      setPodcasts(response.data);
    };
    fetchPodcasts();
  }, []);

  return (
    <div>
      {podcasts.map(podcast => (
        <div key={podcast.id}>
          <Link to={`/podcasts/${podcast.id}`}>{podcast.title}</Link>
        </div>
      ))}
    </div>
  );
};
