import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

export const PodcastPlayer = ({ podcastId }) => {
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      const response = await api.get(`/podcasts/${podcastId}`);
      setPodcast(response.data);
    };
    fetchPodcast();
  }, [podcastId]);

  if (!podcast) return <div>Loading...</div>;

  return (
    <div>
      <h2>{podcast.title}</h2>
      <audio src={podcast.audioUrl} controls />
    </div>
  );
};
