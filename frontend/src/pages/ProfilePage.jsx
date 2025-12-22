
import React, { useState } from 'react';
import styled from 'styled-components';
import ProfileHeader from '../profile/ProfileHeader';
import SpiderWeb from '../components/SpiderWeb';
import ContentGrid from '../profile/ContentGrid';
import './ProfilePage.css';
import { mockUser } from '../mock/user';
import PodcastCard from '../components/podcast/PodcastCard';
import CreatePodcast from '../components/podcast/CreatePodcast';
import ShowPageCustomization from '../components/podcast/ShowPageCustomization';
import Analytics from '../components/podcast/Analytics';
import DetailedAnalytics from '../components/podcast/DetailedAnalytics';
import ImpressionAnalytics from '../components/podcast/ImpressionAnalytics';
import PerformanceMetrics from '../components/podcast/PerformanceMetrics';
import { ListenersPage } from '../components/podcast/ListenersPage';
import { theme } from '../theme/theme';

const ProfilePageContainer = styled.div`
  background-color: ${theme.palette.dark};
  color: ${theme.text.primary};
`;

const SectionContainer = styled.div`
  margin-bottom: 2rem;
  background-color: ${theme.palette.primary};
  padding: 1rem;
  border-radius: 8px;

  h2 {
    color: ${theme.palette.secondary};
    border-bottom: 2px solid ${theme.palette.secondary};
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const AnalyticsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Posts');

  // This would come from an API call eventually
  const collaborationId = 'some-collaboration-id';

  // Filter mock podcasts by author ID (in a real app, this logic would be on the backend)
  // For now, we'll just display all mock podcasts as an example
  const userPodcasts = [
    { id: 1, title: 'My First Podcast', author: 'Elena Rodriguez', cover: 'https://via.placeholder.com/150' },
    { id: 2, title: 'Nyalenda B Stories', author: 'Elena Rodriguez', cover: 'https://via.placeholder.com/150' },
  ];

  return (
    <ProfilePageContainer className="profile-page">
      <ProfileHeader />

      <div className="profile-body">
        <div className="tabs">
          <button onClick={() => setActiveTab('Posts')} className={activeTab === 'Posts' ? 'active' : ''}>Posts</button>
          <button onClick={() => setActiveTab('Spider Web')} className={activeTab === 'Spider Web' ? 'active' : ''}>Spider Web</button>
          <button onClick={() => setActiveTab('Podcasts')} className={activeTab === 'Podcasts' ? 'active' : ''}>Podcasts</button>
          <button onClick={() => setActiveTab('Create Podcast')} className={activeTab === 'Create Podcast' ? 'active' : ''}>Create Podcast</button>
          <button onClick={() => setActiveTab('Podcast Analytics')} className={activeTab === 'Podcast Analytics' ? 'active' : ''}>Podcast Analytics</button>
        </div>

        {activeTab === 'Posts' && <ContentGrid />}
        {activeTab === 'Spider Web' && <SpiderWeb collaborationId={collaborationId} />}
        {activeTab === 'Podcasts' && (
          <div className="podcasts-section">
            {userPodcasts.map(podcast => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        )}
        {activeTab === 'Create Podcast' && (
          <SectionContainer>
            <h2>Create and Customize</h2>
            <CreatePodcast />
            <ShowPageCustomization />
          </SectionContainer>
        )}
        {activeTab === 'Podcast Analytics' && (
          <SectionContainer>
            <h2>Podcast Analytics</h2>
            <AnalyticsContainer>
              <Analytics />
              <DetailedAnalytics />
              <ImpressionAnalytics />
              <PerformanceMetrics />
            </AnalyticsContainer>
            <ListenersPage />
          </SectionContainer>
        )}
      </div>

      <div className="profile-metrics">
        <h3>Metrics & Impact</h3>
        <p>Followers by Intent: Supporters ({mockUser.followers.supporters}), Amplifiers ({mockUser.followers.amplifiers}), Learners ({mockUser.followers.learners})</p>
        <p>Topics Engaged: {mockUser.topics.join(', ')}</p>
        <p>Community Impact Badges: {mockUser.impactBadges.join(', ')}</p>
      </div>

      <footer className="profile-footer">
        <p>Community Rooms: {mockUser.communityRooms.join(', ')}</p>
        <p>Pinned Story: [Link to {mockUser.pinnedStoryId}]</p>
        <button>Request to Collaborate</button>
      </footer>
    </ProfilePageContainer>
  );
};

export default ProfilePage;
