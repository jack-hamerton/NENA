
import React, { useState } from 'react';
import styled from 'styled-components';
import PodcastCard from '../podcast/PodcastCard';

const PodcastsContainer = styled.div`
  margin-bottom: 2rem;
`;

const PodcastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const ShowMoreButton = styled.button`
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
`;

const AddPodcastButton = styled(ShowMoreButton)`
    background-color: #3897f0;
`;

const PodcastsGrid = ({ podcasts }) => {
  const [showAll, setShowAll] = useState(false);
  const visiblePodcasts = showAll ? podcasts : podcasts.slice(0, 4);

  return (
    <PodcastsContainer>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <h2>Podcasts</h2>
            <AddPodcastButton>Add Podcast</AddPodcastButton>
        </div>
      <PodcastGrid>
        {visiblePodcasts.map(podcast => (
          <PodcastCard key={podcast.id} podcast={podcast} />
        ))}
      </PodcastGrid>
      {podcasts.length > 4 && (
        <ShowMoreButton onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : 'Show More'}
        </ShowMoreButton>
      )}
    </PodcastsContainer>
  );
};

export default PodcastsGrid;
