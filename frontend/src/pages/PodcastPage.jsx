
import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from 'styled-components';
import { useMediaQuery, CircularProgress, Typography } from '@mui/material';
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
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    getPodcasts()
      .then((response) => {
        const podcastData = response.data;
        setPodcasts(podcastData);
        if (podcastData.length > 0) {
          const firstPodcast = podcastData[0];
          setSelectedPodcast(firstPodcast);
          if (firstPodcast.episodes && firstPodcast.episodes.length > 0) {
            setSelectedEpisode(firstPodcast.episodes[0]);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('There was an error fetching podcasts.');
        setLoading(false);
        console.error(err);
      });
  }, []);

  const handlePodcastSelect = (podcast) => {
    setSelectedPodcast(podcast);
    if (podcast.episodes && podcast.episodes.length > 0) {
      setSelectedEpisode(podcast.episodes[0]);
    } else {
      setSelectedEpisode(null);
    }
  };

  if (loading) {
    return (
      <PodcastPageContainer>
        <CircularProgress />
      </PodcastPageContainer>
    );
  }

  if (error) {
    return (
      <PodcastPageContainer>
        <Typography color="error">{error}</Typography>
      </PodcastPageContainer>
    );
  }

  return (
    <ThemeProvider theme={appTheme}>
      <PodcastPageContainer>
        <h1 style={{ color: appTheme.palette.secondary.main, textAlign: 'center', marginBottom: '2rem' }}>Podcasts</h1>
        
        <Discovery podcasts={podcasts} onPodcastSelect={handlePodcastSelect} />
        <BestPlaceToStart podcasts={podcasts} onPodcastSelect={handlePodcastSelect} />

        <PodcastListContainer>
          {podcasts.map(podcast => (
            <PodcastCard key={podcast.id} podcast={podcast} onPodcastSelect={handlePodcastSelect} />
          ))}
        </PodcastListContainer>

        {selectedPodcast && selectedEpisode && (
          <>
            <SocialFeaturesContainer>
              <CommentsAndPolls episodeId={selectedEpisode.id} />
              <SocialSharing podcast={selectedPodcast} episode={selectedEpisode} />
              <FollowButtonAndNotifications podcast={selectedPodcast} />
            </SocialFeaturesContainer>

            <HostRecommendations recommendations={selectedPodcast.recommendations} />
            <PodcastPlayer episode={selectedEpisode} />

            <AdditionalFeaturesContainer>
                <EpisodeFeatures notes={selectedEpisode.notes} />
                <VideoPodcasts episode={selectedEpisode} />
                <Transcription transcription={selectedEpisode.transcription} />
            </AdditionalFeaturesContainer>
          </>
        )}
      </PodcastPageContainer>
    </ThemeProvider>
  );
};

export default PodcastPage;
