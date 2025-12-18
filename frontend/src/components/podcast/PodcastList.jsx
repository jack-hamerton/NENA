import React from 'react';

const PodcastList = ({ podcasts }) => {
  return (
    <div>
      <h2>Your Podcasts</h2>
      <ul>
        {podcasts.map((podcast) => (
          <li key={podcast.id}>
            <h3>{podcast.title}</h3>
            <p>{podcast.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PodcastList;
