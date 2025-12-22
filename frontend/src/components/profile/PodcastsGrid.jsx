
import React from 'react';
import styled from 'styled-components';
import PodcastCard from '../podcast/PodcastCard';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const PodcastsGrid = ({ podcasts }) => {
  return (
    <GridContainer>
      {podcasts.map(podcast => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </GridContainer>
  );
};

export default PodcastsGrid;
