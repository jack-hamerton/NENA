
import React from 'react';
import { Card } from './PodcastCard.styled';

const PodcastCard = ({ podcast, onPodcastSelect }) => {
  const handleClick = () => {
    if (onPodcastSelect) {
      onPodcastSelect(podcast);
    }
  };

  return (
    <Card onClick={handleClick}>
      <img src={podcast.imageUrl} alt={podcast.title} />
      <h3>{podcast.title}</h3>
      <p>{podcast.author}</p>
    </Card>
  );
};

export default PodcastCard;
