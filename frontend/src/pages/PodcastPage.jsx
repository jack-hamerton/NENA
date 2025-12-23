
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AdditionalFeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const PodcastPage = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  useEffect(() => {
    getPodcasts().then((response) => {
      setPodcasts(response.data);
      // Set a default podcast to play
      if (response.data.length > 0) {
        setSelectedPodcast(response.data[0]);
      }
    });
  }, []);

  const handlePodcastSelect = (podcast) => {
    setSelectedPodcast(podcast);
  };

  return (
    <PodcastPageContainer>
      <h1 style={{ color: theme.palette.secondary, textAlign: 'center', marginBottom: '2rem' }}>Podcasts</h1>
      <Discovery podcasts={podcasts} onPodcastSelect={handlePodcastSelect} />
      <BestPlaceToStart podcasts={podcasts} onPodcastSelect={handlePodcastSelect} />
      <PodcastListContainer>
        {podcasts.map(podcast => (
          <PodcastCard key={podcast.id} podcast={podcast} onPodcastSelect={handlePodcastSelect} />
        ))}
      </PodcastListContainer>
      {selectedPodcast && (
        <>
          <SocialFeaturesContainer>
            <CommentsAndPolls />
            <SocialSharing />
            <FollowButtonAndNotifications podcast={selectedPodcast} />
          </SocialFeaturesContainer>
          <HostRecommendations recommendations={selectedPodcast.recommendations} />
          <PodcastPlayer podcast={selectedPodcast} />
          <AdditionalFeaturesContainer>
            <EpisodeFeatures notes={selectedPodcast.notes} />
            <VideoPodcasts podcast={selectedPodcast} />
            <Transcription transcription={selectedPodcast.transcription} />
          </AdditionalFeaturesContainer>
        </>
      )}
    </PodcastPageContainer>
  );
};

export default PodcastPage;
