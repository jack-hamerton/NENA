
import React, { useState, useEffect } from 'react';
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
  const isMobile = window.innerWidth <= 600;

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        setLoading(true);
        const response = await getPodcasts();
        const podcastData = response.data || [];
        setPodcasts(podcastData);
        if (podcastData.length > 0) {
          const firstPodcast = podcastData[0];
          setSelectedPodcast(firstPodcast);
          if (firstPodcast.episodes && firstPodcast.episodes.length > 0) {
            setSelectedEpisode(firstPodcast.episodes[0]);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching podcasts:', err);
        setError('Failed to load podcasts. Please check your connection and try again.');
        setLoading(false);
        // Set some mock data for development
        const mockPodcasts = [
          {
            id: 1,
            title: 'Sample Podcast',
            author: 'Sample Author',
            imageUrl: 'https://via.placeholder.com/300x300?text=Podcast',
            episodes: [
              {
                id: 1,
                title: 'Sample Episode',
                notes: 'Sample notes',
                transcription: 'Sample transcription'
              }
            ],
            recommendations: []
          }
        ];
        setPodcasts(mockPodcasts);
        setSelectedPodcast(mockPodcasts[0]);
        setSelectedEpisode(mockPodcasts[0].episodes[0]);
        setLoading(false);
      }
    };

    fetchPodcasts();
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
        <Typography color="error" style={{ textAlign: 'center', marginTop: '2rem' }}>
          {error}
        </Typography>
        <Typography style={{ textAlign: 'center', marginTop: '1rem', color: appTheme.palette.text.secondary }}>
          Please try refreshing the page or check back later.
        </Typography>
      </PodcastPageContainer>
    );
  }

  return (
    <PodcastPageContainer>
      <h1 style={{ color: appTheme.palette.secondary.main, textAlign: 'center', marginBottom: '2rem' }}>Podcasts</h1>
      
      <Discovery podcasts={podcasts} onPodcastSelect={handlePodcastSelect} />
      <BestPlaceToStart onPodcastSelect={handlePodcastSelect} />

      <PodcastListContainer>
        {podcasts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: appTheme.palette.text.secondary }}>
            <h3>No podcasts available</h3>
            <p>Check back later for new content!</p>
          </div>
        ) : (
          podcasts.map(podcast => (
            <PodcastCard key={podcast.id} podcast={podcast} onPodcastSelect={handlePodcastSelect} />
          ))
        )}
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
  );
};

export default PodcastPage;
