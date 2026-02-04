
import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from 'styled-components';
import { useMediaQuery, Grid, Button, CircularProgress, Typography, Modal } from '@mui/material';
import PostsGrid from '../components/profile/PostsGrid';
import PodcastsGrid from '../components/profile/PodcastsGrid';
import SpiderWebCanvas from '../components/profile/SpiderWebCanvas';
import ProfileHeader from '../components/profile/ProfileHeader';
import IntentModal from '../components/profile/IntentModal';
import CreatePodcast from '../components/profile/CreatePodcast';
import { theme as appTheme } from '../theme/theme';
import {
  getUserById,
  getFollowers,
  getFollowing,
  followUser,
  getUserPosts,
  getUserPodcasts,
  getFollowerIntentMetrics,
  getUserHashtagMetrics,
  getUserBadges,
  getFollowersOfFollowers
} from '../services/user.service';
import {
    ProfilePageContainer,
    SpiderWebCanvasSection,
    ContentSection,
    MetricsSection,
    ProfileFooter
} from './ProfilePage.styled';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersOfFollowers, setFollowersOfFollowers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
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
      try {
        const [userResponse, followersResponse, followingResponse, followersOfFollowersResponse, postsResponse, podcastsResponse, followerIntentMetricsResponse, hashtagMetricsResponse, badgesResponse] = await Promise.all([
          getUserById(id),
          getFollowers(id),
          getFollowing(id),
          getFollowersOfFollowers(id),
          getUserPosts(id),
          getUserPodcasts(id),
          getFollowerIntentMetrics(id),
          getUserHashtagMetrics(id),
          getUserBadges(id),
        ]);
        setUser(userResponse.data);
        setFollowers(followersResponse.data);
        setFollowing(followingResponse.data);
        setFollowersOfFollowers(followersOfFollowersResponse);
        setPosts(postsResponse.data);
        setPodcasts(podcastsResponse.data);
        setFollowerIntentMetrics(followerIntentMetricsResponse.data);
        setHashtagMetrics(hashtagMetricsResponse.data);
        setBadges(badgesResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleFollow = async (intent) => {
    try {
      await followUser(id, intent);
      const followersResponse = await getFollowers(id);
      setFollowers(followersResponse.data);
      setIntentModalOpen(false);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!user) {
    return <Typography>User not found</Typography>;
  }

  const postsToShow = isMobile ? 4 : 8;
  const podcastsToShow = isMobile ? 2 : 4;

  return (
    <ThemeProvider theme={appTheme}>
      <ProfilePageContainer>
        <ProfileHeader user={user} followerCount={followers.length} followingCount={following.length} onFollow={() => setIntentModalOpen(true)} />
        <IntentModal open={intentModalOpen} onClose={() => setIntentModalOpen(false)} onFollow={handleFollow} />

        <Grid container spacing={isMobile ? 2 : 4}>
          <Grid item xs={12} md={6}>
            <SpiderWebCanvasSection>
              <SpiderWebCanvas currentUser={user} follows={followers} followersOfFollowers={followersOfFollowers} followerIntentMetrics={followerIntentMetrics} />
            </SpiderWebCanvasSection>
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricsSection>
              <Typography variant="h6" gutterBottom>Metrics & Impact</Typography>
              {followerIntentMetrics && (
                <Typography variant="body2">Followers by Intent: Supporters ({followerIntentMetrics.supporters}), Amplifiers ({followerIntentMetrics.amplifiers}), Learners ({followerIntentMetrics.learners})</Typography>
              )}
              {hashtagMetrics.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>Topics Engaged: {hashtagMetrics.map(metric => `${metric.tag} (${metric.count})`).join(', ')}</Typography>
              )}
              {badges.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>Community Impact Badge: {badges.map(badge => badge.name).join(', ')}</Typography>
              )}
            </MetricsSection>
          </Grid>
        </Grid>

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

        <ContentSection>
            <div className="section-header">
                <Typography variant="h5">Podcasts</Typography>
                <div>
                    <Button onClick={() => setCreatePodcastModalOpen(true)}>Create Podcast</Button>
                    {podcasts.length > podcastsToShow && (
                        <Button onClick={() => setShowMorePodcasts(!showMorePodcasts)}>
                            {showMorePodcasts ? 'Show Less' : 'Show More'}
                        </Button>
                    )}
                </div>
            </div>
            <PodcastsGrid podcasts={showMorePodcasts ? podcasts : podcasts.slice(0, podcastsToShow)} />
        </ContentSection>
        
        <Modal open={createPodcastModalOpen} onClose={() => setCreatePodcastModalOpen(false)}>
            <CreatePodcast />
        </Modal>

        <ProfileFooter>
          <Button variant="outlined">Community Rooms</Button>
          <Button variant="outlined">Pinned Story</Button>
          <Button variant="contained">Request to Collaborate</Button>
        </ProfileFooter>
      </ProfilePageContainer>
    </ThemeProvider>
  );
};

export default ProfilePage;
