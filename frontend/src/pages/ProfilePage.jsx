
import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ProfileHeader from '../profile/ProfileHeader';
import SpiderWeb from '../components/SpiderWeb';
import PostsGrid from '../components/profile/PostsGrid';
import PodcastsGrid from '../components/profile/PodcastsGrid';
import { mockUser } from '../mock/user';
import { theme } from '../theme/theme';
import {
    ProfilePageContainer,
    ProfileBody,
    ProfileMetrics,
    ProfileFooter
} from './ProfilePage.styled';

const SectionContainer = styled.div`
  margin-bottom: 2rem;
  background-color: ${props => props.theme.palette.primary};
  padding: 1rem;
  border-radius: 8px;

  h2 {
    color: ${props => props.theme.palette.secondary};
    border-bottom: 2px solid ${props => props.theme.palette.secondary};
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Posts');

  const userPodcasts = [
    { id: 1, title: 'My First Podcast', author: 'Elena Rodriguez', imageUrl: 'https://via.placeholder.com/150' },
    { id: 2, title: 'Nyalenda B Stories', author: 'Elena Rodriguez', imageUrl: 'https://via.placeholder.com/150' },
  ];

  const userPosts = [
      { id: 1, content: 'This is my first post!' },
      { id: 2, content: 'Here is another post!' },
      { id: 3, content: 'I am really enjoying this platform.' },
      { id: 4, content: 'Just posted a new podcast, check it out!' },
      { id: 5, content: 'Thinking about my next project...' },
      { id: 6, content: 'Just hit 1000 followers! Thank you all!' },
      { id: 7, content: 'The community here is amazing.' },
      { id: 8, content: 'I love sharing my stories with you all.' },
      { id: 9, content: 'This is my ninth post.' },
  ];

  return (
    <ThemeProvider theme={theme}>
        <ProfilePageContainer>
        <ProfileHeader />

        <ProfileBody>
            <div className="tabs">
            <button onClick={() => setActiveTab('Posts')} className={activeTab === 'Posts' ? 'active' : ''}>Posts</button>
            <button onClick={() => setActiveTab('Spider Web')} className={activeTab === 'Spider Web' ? 'active' : ''}>Spider Web</button>
            <button onClick={() => setActiveTab('Podcasts')} className={activeTab === 'Podcasts' ? 'active' : ''}>Podcasts</button>
            </div>

            {activeTab === 'Posts' && <PostsGrid posts={userPosts} />}
            {activeTab === 'Spider Web' && <SpiderWeb />}
            {activeTab === 'Podcasts' && <PodcastsGrid podcasts={userPodcasts} />}
        </ProfileBody>

        <ProfileMetrics>
            <h3>Metrics & Impact</h3>
            <p>Followers by Intent: Supporters ({mockUser.followers.supporters}), Amplifiers ({mockUser.followers.amplifiers}), Learners ({mockUser.followers.learners})</p>
            <p>Topics Engaged: {mockUser.topics.join(', ')}</p>
            <p>Community Impact Badges: {mockUser.impactBadges.join(', ')}</p>
        </ProfileMetrics>

        <ProfileFooter>
            <p>Community Rooms: {mockUser.communityRooms.join(', ')}</p>
            <p>Pinned Story: [Link to {mockUser.pinnedStoryId}]</p>
            <button>Request to Collaborate</button>
        </ProfileFooter>
        </ProfilePageContainer>
    </ThemeProvider>
  );
};

export default ProfilePage;
