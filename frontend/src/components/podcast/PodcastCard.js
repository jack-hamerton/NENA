
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PodcastCard = ({ podcast }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/player?id=${podcast.id}`);
  };

  return (
    <div onClick={handleClick}>
      <img src={podcast.imageUrl} alt={podcast.title} />
      <h3>{podcast.title}</h3>
      <p>{podcast.author}</p>
    </div>
  );
};

export default PodcastCard;
