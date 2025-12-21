
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { SpiderWeb } from '../SpiderWeb';
import { api } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import { darkTheme } from '../../theme';

// --- Styled Components ---
const ProfileContainer = styled.div`
  color: ${darkTheme.palette.text.primary};
  padding: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileInfo = styled.div`
  margin-left: 2rem;
`;

const FollowerStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const VideoTabs = styled.div`
  margin-top: 2rem;
  border-bottom: 1px solid ${darkTheme.palette.divider};
  padding-bottom: 1rem;
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${darkTheme.palette.text.secondary};
  cursor: pointer;
  padding: 1rem;
  font-size: 1rem;

  &.active {
    color: ${darkTheme.palette.primary.main};
    border-bottom: 2px solid ${darkTheme.palette.primary.main};
  }
`;

const SettingsButton = styled.button`
  background-color: ${darkTheme.palette.background.paper};
  color: ${darkTheme.palette.text.primary};
  border: 1px solid ${darkTheme.palette.divider};
  padding: 0.5rem 1rem;
  cursor: pointer;
  margin-top: 1rem;
`;

// --- UserProfile Component ---
export const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    const fetchUser = async () => {
      const response = await api.get(`/users/${userId}`);
      setUser(response.data);
    };
    fetchUser();
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  const isOwnProfile = currentUser && currentUser.id === user.id;

  return (
    <ProfileContainer>
      <ProfileHeader>
        <img src={user.profilePicture} alt={user.name} width="150" height="150" />
        <ProfileInfo>
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
          <a href={user.externalLink} target="_blank" rel="noopener noreferrer">
            {user.externalLink}
          </a>
          <FollowerStats>
            <div>
              <strong>{user.followers.length}</strong> Followers
            </div>
            <div>
              <strong>{user.following.length}</strong> Following
            </div>
          </FollowerStats>
        </ProfileInfo>
      </ProfileHeader>

      <SpiderWeb followers={user.followers} following={user.following} />

      <VideoTabs>
        <Tab
          className={activeTab === 'videos' ? 'active' : ''}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </Tab>
        <Tab
          className={activeTab === 'playlists' ? 'active' : ''}
          onClick={() => setActiveTab('playlists')}
        >
          Playlists
        </Tab>
        {isOwnProfile && (
          <Tab
            className={activeTab === 'private' ? 'active' : ''}
            onClick={() => setActiveTab('private')}
          >
            Private
          </Tab>
        )}
        <Tab
          className={activeTab === 'liked' ? 'active' : ''}
          onClick={() => setActiveTab('liked')}
        >
          Liked
        </Tab>
        <Tab
          className={activeTab === 'reposts' ? 'active' : ''}
          onClick={() => setActiveTab('reposts')}
        >
          Reposts
        </Tab>
      </VideoTabs>

      {/* Placeholder for video content */}
      <div>
        <h3>{activeTab}</h3>
        {/* You can map through user's videos, playlists, etc. here */}
      </div>

      {isOwnProfile && (
        <>
          <SettingsButton onClick={() => (window.location.href = '/settings/privacy')}>
            Privacy Settings
          </SettingsButton>
          <SettingsButton onClick={() => (window.location.href = '/podcast/create')}>
            Create Podcast
          </SettingsButton>
        </>
      )}

      <div>
        <h4>Profile View History</h4>
        {/* You can show profile view history here */}
      </div>

      <div>
        <h4>Creator/Business Tools</h4>
        {/* You can show creator/business tools here */}
      </div>
    </ProfileContainer>
  );
};
