
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getPodcasts } from '../services/podcast.service';
import PodcastCard from '../components/podcast/PodcastCard';
import Discovery from '../components/podcast/Discovery';
import BestPlaceToStart from '../components/podcast/BestPlaceToStart';
import HostRecommendations from '../components/podcast/HostRecommendations';
import CommentsAndPolls from '../components/podcast/CommentsAndPolls';
import SocialSharing from '../components/podcast/SocialSharing';
import FollowButtonAndNotifications from '../components/podcast/FollowButtonAndNotifications';
import PodcastPlayer from '../components/podcast/PodcastPlayer';
import EpisodeFeatures from '../components/podcast/EpisodeFeatures';
import VideoPodcasts from '../components/podcast/VideoPodcasts';
import Transcription from '../components/podcast/Transcription';
import { theme } from '../theme/theme';

const PodcastPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background-color: ${theme.palette.dark};
  color: ${theme.text.primary};
`;

const PodcastListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SocialFeaturesContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AdditionalFeaturesContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const PodcastPage = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    getPodcasts().then((response) => {
      setPodcasts(response.data);
    });
  }, []);

  return (
    <PodcastPageContainer>
      <h1 style={{ color: theme.palette.secondary }}>Podcasts</h1>
      <Discovery />
      <PodcastListContainer>
        {podcasts.map(podcast => (
          <PodcastCard key={podcast.id} podcast={podcast} />
        ))}
      </PodcastListContainer>
      <SocialFeaturesContainer>
        <CommentsAndPolls />
        <SocialSharing />
        <FollowButtonAndNotifications />
      </SocialFeaturesContainer>
      <BestPlaceToStart />
      <HostRecommendations />
      <PodcastPlayer />
      <AdditionalFeaturesContainer>
        <EpisodeFeatures />
        <VideoPodcasts />
        <Transcription />
      </AdditionalFeaturesContainer>
    </PodcastPageContainer>
  );
};

export default PodcastPage;
