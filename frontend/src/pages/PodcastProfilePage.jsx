import React, { useState } from 'react';
import ShowPageCustomization from '../components/podcast/ShowPageCustomization';
import BestPlaceToStart from '../components/podcast/BestPlaceToStart';
import HostRecommendations from '../components/podcast/HostRecommendations';
import VideoPodcasts from '../components/podcast/VideoPodcasts';
import Clips from '../components/podcast/Clips';
import EpisodeFeatures from '../components/podcast/EpisodeFeatures';
import CommentsAndPolls from '../components/podcast/CommentsAndPolls';
import FollowButtonAndNotifications from '../components/podcast/FollowButtonAndNotifications';
import DetailedAnalytics from '../components/podcast/DetailedAnalytics';
import ImpressionAnalytics from '../components/podcast/ImpressionAnalytics';
import PerformanceMetrics from '../components/podcast/PerformanceMetrics';

const PodcastProfilePage = () => {
  return (
    <div>
      <h1>Podcast Profile Page</h1>
      <ShowPageCustomization />
      <BestPlaceToStart />
      <HostRecommendations />
      <VideoPodcasts />
      <Clips />
      <EpisodeFeatures />
      <CommentsAndPolls />
      <FollowButtonAndNotifications />
      <DetailedAnalytics />
      <ImpressionAnalytics />
      <PerformanceMetrics />
    </div>
  );
};

export default PodcastProfilePage;
