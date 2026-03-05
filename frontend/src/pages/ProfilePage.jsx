
import React, { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import { useMediaQuery, Grid, Button, CircularProgress, Typography, Modal, Box } from '@mui/material';
import PostsGrid from '../components/profile/PostsGrid';
import PodcastsGrid from '../components/profile/PodcastsGrid';
import SpiderWebCanvas from '../components/profile/SpiderWebCanvas';
import ProfileHeader from '../components/profile/ProfileHeader';
import IntentModal from '../components/profile/IntentModal';
import CreatePodcast from '../components/profile/CreatePodcast';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import { Calendar } from '../components/calendar/Calendar';
import ProfileMetrics from '../components/profile/ProfileMetrics';
import profileService from '../services/profile.service';
import {
    ProfilePageContainer,
    SpiderWebCanvasSection,
    ContentSection,
    MetricsSection,
    ProfileFooter
} from './ProfilePage.styled';
import { useParams } from 'react-router-dom';
import { followUser, getUserPosts, getUserPodcasts } from '../services/user.service';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMorePosts, setShowMorePosts] = useState(false);
  const [showMorePodcasts, setShowMorePodcasts] = useState(false);
  const [intentModalOpen, setIntentModalOpen] = useState(false);
  const [createPodcastModalOpen, setCreatePodcastModalOpen] = useState(false);
  const [followerIntentMetrics, setFollowerIntentMetrics] = useState(null);
  const [hashtagMetrics, setHashtagMetrics] = useState([]);
  const [badges, setBadges] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileResponse, postsResponse, podcastsResponse] = await Promise.all([
          profileService.getProfileData(id),
          getUserPosts(id),
          getUserPodcasts(id),
        ]);
        
        // Ensure user data exists
        const userData = profileResponse.data?.user || { id, name: 'Unknown', followers: [] };
        
        setUser(userData);
        setFollowers(userData.followers || []);
        setFollowerIntentMetrics(profileResponse.data?.followerIntentMetrics || {});
        
        // Set posts - ensure it's always an array
        setPosts(Array.isArray(postsResponse) ? postsResponse : (postsResponse?.data || []));
        
        // Set podcasts - ensure it's always an array
        setPodcasts(Array.isArray(podcastsResponse) ? podcastsResponse : (podcastsResponse?.data || []));

      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load profile. Please try again.");
        setUser({ id, name: 'Unknown', followers: [] });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const handleFollow = async (intent) => {
    try {
      if (!currentUser || !currentUser.id) {
        setError("You must be logged in to follow users.");
        return;
      }
      
      await followUser(currentUser.id, id, intent);
      // Refresh profile data after following
      const profileResponse = await profileService.getProfileData(id);
      const userData = profileResponse.data?.user || { id, name: 'Unknown', followers: [] };
      setFollowers(userData.followers || []);
      setIntentModalOpen(false);
    } catch (error) {
      console.error("Error following user:", error);
      setError("Failed to follow user. Please try again.");
    }
  };

  if (loading) {
    return (
      <ProfilePageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </ProfilePageContainer>
    );
  }

  if (error) {
    return (
      <ProfilePageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column">
          <Typography color="error" variant="h6" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Box>
      </ProfilePageContainer>
    );
  }

  if (!user) {
    return (
      <ProfilePageContainer>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6">User not found</Typography>
        </Box>
      </ProfilePageContainer>
    );
  }

  const postsToShow = isMobile ? 4 : 8;
  const podcastsToShow = isMobile ? 2 : 4;
  const isOwnProfile = currentUser && currentUser.id === id;

  return (
      <ProfilePageContainer>
        <ProfileHeader 
          user={user} 
          followerCount={followers.length} 
          followingCount={following.length} 
          onFollow={() => !isOwnProfile && setIntentModalOpen(true)} 
        />
        {!isOwnProfile && (
          <IntentModal 
            open={intentModalOpen} 
            onClose={() => setIntentModalOpen(false)} 
            onFollow={handleFollow} 
          />
        )}

        <Grid container spacing={isMobile ? 2 : 4}>
          <Grid item xs={12} md={6}>
            <SpiderWebCanvasSection>
              {followerIntentMetrics && (
                <SpiderWebCanvas 
                  currentUser={user} 
                  follows={followers} 
                  followersOfFollowers={[]} 
                  followerIntentMetrics={followerIntentMetrics} 
                />
              )}
            </SpiderWebCanvasSection>
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricsSection>
              <Typography variant="h6" gutterBottom>Metrics & Impact</Typography>
              {(followerIntentMetrics || hashtagMetrics.length > 0 || badges.length > 0) && (
                <ProfileMetrics 
                  followerIntentMetrics={followerIntentMetrics} 
                  hashtagMetrics={hashtagMetrics} 
                  badges={badges} 
                />
              )}
              <AnalyticsDashboard showTitle={false} />
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Calendar</Typography>
              <Calendar userId={id} />
            </MetricsSection>
          </Grid>
        </Grid>

        {posts.length > 0 && (
          <ContentSection>
            <div className="section-header">
              <Typography variant="h5">Posts</Typography>
              {posts.length > postsToShow && (
                  <Button onClick={() => setShowMorePosts(!showMorePosts)}>
                  {showMorePosts ? 'Show Less' : 'Show More'}
                  </Button>
              )}
            </div>
            <PostsGrid posts={showMorePosts ? posts : posts.slice(0, postsToShow)} />
          </ContentSection>
        )}

        {podcasts.length > 0 && (
          <ContentSection>
              <div className="section-header">
                  <Typography variant="h5">Podcasts</Typography>
                  <div>
                      {isOwnProfile && (
                        <Button onClick={() => setCreatePodcastModalOpen(true)}>Create Podcast</Button>
                      )}
                      {podcasts.length > podcastsToShow && (
                          <Button onClick={() => setShowMorePodcasts(!showMorePodcasts)}>
                              {showMorePodcasts ? 'Show Less' : 'Show More'}
                          </Button>
                      )}
                  </div>
              </div>
              <PodcastsGrid podcasts={showMorePodcasts ? podcasts : podcasts.slice(0, podcastsToShow)} />
          </ContentSection>
        )}
        
        {isOwnProfile && (
          <Modal open={createPodcastModalOpen} onClose={() => setCreatePodcastModalOpen(false)}>
              <CreatePodcast />
          </Modal>
        )}

        <ProfileFooter>
          <Button variant="outlined">Community Rooms</Button>
          <Button variant="outlined">Pinned Story</Button>
          {!isOwnProfile && (
            <Button variant="contained">Request to Collaborate</Button>
          )}
        </ProfileFooter>
      </ProfilePageContainer>
  );
};

export default ProfilePage;
