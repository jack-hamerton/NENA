
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/theme';
import { getTopPodcasts } from '../../services/podcast.service';

const BestPlaceToStartContainer = styled.div`
  margin-bottom: 2rem;
`;

const PodcastList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const PodcastItem = styled.div`
  cursor: pointer;
`;

const BestPlaceToStart = ({ onPodcastSelect }) => {
  const [topListened, setTopListened] = useState([]);
  const [topViewed, setTopViewed] = useState([]);
  const [userRegion, setUserRegion] = useState('US'); // Placeholder for user region

  useEffect(() => {
    // Fetch top listened podcasts
    getTopPodcasts('listened', userRegion).then(response => {
      setTopListened(response.data);
    });

    // Fetch top viewed podcasts
    getTopPodcasts('viewed', userRegion).then(response => {
      setTopViewed(response.data);
    });
  }, [userRegion]);

  return (
    <BestPlaceToStartContainer>
      <h3>Best Place to Start</h3>
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Top 10 Most Listened in {userRegion}</h4>
        <PodcastList>
          {topListened.map(podcast => (
            <PodcastItem key={podcast.id} onClick={() => onPodcastSelect(podcast)}>
              {podcast.title}
            </PodcastItem>
          ))}
        </PodcastList>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <h4 style={{ marginBottom: '0.5rem' }}>Top 10 Most Viewed in {userRegion}</h4>
        <PodcastList>
          {topViewed.map(podcast => (
            <PodcastItem key={podcast.id} onClick={() => onPodcastSelect(podcast)}>
              {podcast.title}
            </PodcastItem>
          ))}
        </PodcastList>
      </div>
    </BestPlaceToStartContainer>
  );
};

export default BestPlaceToStart;
