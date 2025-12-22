
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import PostsGrid from '../components/profile/PostsGrid';
import PodcastsGrid from '../components/profile/PodcastsGrid';
import SpiderWebCanvas from '../components/profile/SpiderWebCanvas';
import ProfileHeader from '../components/profile/ProfileHeader';
import IntentModal from '../components/profile/IntentModal';
import CreatePodcast from '../components/profile/CreatePodcast';
import { theme } from '../theme/theme';
import { getUserById, getFollowers, followUser, getUserPosts, getUserPodcasts } from '../services/user.service';
import {
    ProfilePageContainer,
    SpiderWebCanvasSection,
    ContentSection,
    MetricsSection,
    ProfileFooter
} from './ProfilePage.styled';
import { Button, CircularProgress, Typography, Modal } from '@mui/material';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMorePosts, setShowMorePosts] = useState(false);
  const [showMorePodcasts, setShowMorePodcasts] = useState(false);
  const [intentModalOpen, setIntentModalOpen] = useState(false);
  const [createPodcastModalOpen, setCreatePodcastModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, followersResponse, postsResponse, podcastsResponse] = await Promise.all([
          getUserById(id),
          getFollowers(id),
          getUserPosts(id),
          getUserPodcasts(id),
        ]);
        setUser(userResponse.data);
        setFollowers(followersResponse.data);
        setPosts(postsResponse.data);
        setPodcasts(podcastsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleFollow = async (intent) => {
    try {
      await followUser(id, intent);
      // Refresh followers after following
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

  return (
    <ThemeProvider theme={theme}>
      <ProfilePageContainer>
        <ProfileHeader user={user} onFollow={() => setIntentModalOpen(true)} />
        <IntentModal open={intentModalOpen} onClose={() => setIntentModalOpen(false)} onFollow={handleFollow} />

        <SpiderWebCanvasSection>
          <SpiderWebCanvas currentUser={user} follows={followers} />
        </SpiderWebCanvasSection>

        <ContentSection>
          <div className="section-header">
            <Typography variant="h5">Posts</Typography>
            <Button onClick={() => setShowMorePosts(!showMorePosts)}>
              {showMorePosts ? 'Show Less' : 'Show More'}
            </Button>
          </div>
          <PostsGrid posts={showMorePosts ? posts : posts.slice(0, 8)} />
        </ContentSection>

        <ContentSection>
        <div className="section-header">
            <Typography variant="h5">Podcasts</Typography>
            <Button onClick={() => setCreatePodcastModalOpen(true)}>Create Podcast</Button>
            <Button onClick={() => setShowMorePodcasts(!showMorePodcasts)}>
                {showMorePodcasts ? 'Show Less' : 'Show More'}
            </Button>
        </div>
        <PodcastsGrid podcasts={showMorePodcasts ? podcasts : podcasts.slice(0, 4)} />
        </ContentSection>
        
        <Modal open={createPodcastModalOpen} onClose={() => setCreatePodcastModalOpen(false)}>
            <CreatePodcast />
        </Modal>

        <MetricsSection>
          <h3>Metrics & Impact</h3>
          <p>Followers by Intent (Supporters: 120, Amplifiers: 45, Learners: 200)</p>
          <p>Topics Engaged (#YouthVoices, #ClimateJustice)</p>
          <p>Community Impact Badge (Challenge Contributor)</p>
        </MetricsSection>

        <ProfileFooter>
          <Button>Community Rooms</Button>
          <Button>Pinned Story</Button>
          <Button>Request to Collaborate</Button>
        </ProfileFooter>
      </ProfilePageContainer>
    </ThemeProvider>
  );
};

export default ProfilePage;
