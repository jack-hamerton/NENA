
import React, { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import { useMediaQuery, Grid, Button, CircularProgress, Typography, Modal } from '@mui/material';
import PostsGrid from '../components/profile/PostsGrid';
import PodcastsGrid from '../components/profile/PodcastsGrid';
import SpiderWebCanvas from '../components/profile/SpiderWebCanvas';
import ProfileHeader from '../components/profile/ProfileHeader';
import IntentModal from '../components/profile/IntentModal';
import CreatePodcast from '../components/profile/CreatePodcast';
import AdvocacyImpactMatrix from '../components/analytics/AdvocacyImpactMatrix';
import Calendar from '../components/calendar/Calendar';
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

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
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
        const [profileResponse, postsResponse, podcastsResponse] = await Promise.all([
          profileService.getProfileData(id),
          getUserPosts(id),
          getUserPodcasts(id),
        ]);
        setUser(profileResponse.data.user);
        setFollowers(profileResponse.data.user.followers);
        setFollowerIntentMetrics(profileResponse.data.followerIntentMetrics);
        setPosts(postsResponse.data);
        setPodcasts(podcastsResponse.data);

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
      const profileResponse = await profileService.getProfileData(id);
      setFollowers(profileResponse.data.user.followers);
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
      <ProfilePageContainer>
        <ProfileHeader user={user} followerCount={followers.length} followingCount={following.length} onFollow={() => setIntentModalOpen(true)} />
        <IntentModal open={intentModalOpen} onClose={() => setIntentModalOpen(false)} onFollow={handleFollow} />

        <Grid container spacing={isMobile ? 2 : 4}>
          <Grid item xs={12} md={6}>
            <SpiderWebCanvasSection>
              <SpiderWebCanvas currentUser={user} follows={followers} followersOfFollowers={[]} followerIntentMetrics={followerIntentMetrics} />
            </SpiderWebCanvasSection>
          </Grid>
          <Grid item xs={12} md={6}>
            <MetricsSection>
              <Typography variant="h6" gutterBottom>Metrics & Impact</Typography>
              <ProfileMetrics followerIntentMetrics={followerIntentMetrics} hashtagMetrics={hashtagMetrics} badges={badges} />
              <AdvocacyImpactMatrix userId={id} />
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Calendar</Typography>
              <Calendar userId={id} />
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
  );
};

export default ProfilePage;
