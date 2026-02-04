
import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from 'styled-components';
import { useMediaQuery } from '@mui/material';
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
import { theme as appTheme } from '../theme/theme';
import {
  PodcastPageContainer,
  PodcastListContainer,
  SocialFeaturesContainer,
  AdditionalFeaturesContainer,
} from './PodcastPage.styled';

const PodcastPage = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    getPodcasts().then((response) => {
      setPodcasts(response.data);
      if (response.data.length > 0) {
        setSelectedPodcast(response.data[0]);
      }
    });
  }, []);

  const handlePodcastSelect = (podcast) => {
    setSelectedPodcast(podcast);
  };

  return (
    <ThemeProvider theme={appTheme}>
      <PodcastPageContainer>
        <h1 style={{ color: appTheme.palette.secondary, textAlign: 'center', marginBottom: '2rem' }}>Podcasts</h1>
        
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
    </ThemeProvider>
  );
};

export default PodcastPage;
