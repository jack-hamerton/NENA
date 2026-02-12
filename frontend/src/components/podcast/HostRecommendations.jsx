
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';
import PodcastCard from './PodcastCard'; // Reusing the PodcastCard component

const RecommendationsContainer = styled.div`
  margin-bottom: 2rem;
`;

const RecommendationsList = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 1rem 0;
`;

const HostRecommendations = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return null; // Don't render the component if there are no recommendations
  }

  return (
    <RecommendationsContainer>
      <h3 style={{ color: theme.text.primary }}>Host Recommendations</h3>
      <RecommendationsList>
        {recommendations.map(rec => (
          <PodcastCard key={rec.id} podcast={rec} />
        ))}
      </RecommendationsList>
    </RecommendationsContainer>
  );
};

export default HostRecommendations;
