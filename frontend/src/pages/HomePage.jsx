
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useMediaQuery, useTheme, Grid } from '@mui/material';
import ActivityFeed from '../feed/ActivityFeed';
import * as postService from '../services/post.service';
import { followUser } from '../services/user.service';
import CreatePostModal from '../components/modals/CreatePostModal';
import IntentModal from '../components/profile/IntentModal';
import CampaignHubModal from '../components/modals/CampaignHubModal';
import FeedControlNav from '../layout/FeedControlNav';
import { useAuth } from '../hooks/useAuth';

const HomePageContainer = styled.div`
  background-color: ${props => props.theme.palette.background.default};
  min-height: 100vh;
`;

const MainContent = styled.div`
  height: 100vh;
  overflow-y: auto;
  border-left: 1px solid ${props => props.theme.palette.divider};
  border-right: 1px solid ${props => props.theme.palette.divider};
`;

const RightSidebar = styled.div`
  height: 100vh;
  overflow-y: auto;
  padding: 1.5rem;
`;

const HashtagHeader = styled.div`
    position: sticky;
    top: 0;
    background-color: rgba(0,0,0,0.85);
    padding: 1rem;
    z-index: 10;
    text-align: center;
    color: #fff;
    width: 100%;
`;

const HomePage = () => {
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [feedType, setFeedType] = useState('for-you');
  const [hashtagFilter, setHashtagFilter] = useState(null);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [intentModalOpen, setIntentModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isCampaignHubOpen, setCampaignHubOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const fetchPosts = useCallback(async () => {
    try {
        let response;
        if (hashtagFilter) {
            response = await postService.getPostsByHashtag(hashtagFilter);
        } else {
            response = feedType === 'for-you'
                ? await postService.getForYouFeed()
                : await postService.getFollowingFeed();
        }
      
      const postsData = response.data || [];
      const postsWithReportStatus = postsData.map(post => ({ ...post, isReported: false }));
      setPosts(postsWithReportStatus);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      // Set mock data for development/offline functionality
      const mockPosts = [
        {
          id: 1,
          author_id: 'demo-user-1',
          author: { username: 'Jack Hamerton', profile_picture_url: 'https://i.pravatar.cc/150?u=john' },
          content: 'Check out this amazing new feature! 🎉',
          image_url: 'https://via.placeholder.com/500x300?text=Post+1',
          video_url: null,
          created_at: new Date().toISOString(),
          like_count: 42,
          comment_count: 5,
          repost_count: 3,
          is_liked: false,
          isReported: false
        },
        {
          id: 2,
          author_id: 'demo-user-2',
          author: { username: 'Jane Smith', profile_picture_url: 'https://i.pravatar.cc/150?u=jane' },
          content: 'Just posted a quick video update! #NewContent',
          image_url: null,
          video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          like_count: 28,
          comment_count: 8,
          repost_count: 2,
          is_liked: false,
          isReported: false
        },
        {
          id: 3,
          author_id: 'demo-user-3',
          author: { username: 'Mike Johnson', profile_picture_url: 'https://i.pravatar.cc/150?u=mike' },
          content: 'Loving the new update! Great work team 💪 #Awesome',
          image_url: null,
          video_url: null,
          created_at: new Date(Date.now() - 7200000).toISOString(),
          like_count: 15,
          comment_count: 3,
          repost_count: 1,
          is_liked: false,
          isReported: false
        }
      ];
      setPosts(mockPosts);
    }
  }, [feedType, hashtagFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  const handleHashtagClick = (hashtag) => {
      setHashtagFilter(hashtag.substring(1));
  }

  const handleCampaignClick = (campaignName) => {
    setSelectedCampaign(campaignName);
    setCampaignHubOpen(true);
  };

  const handleCloseCampaignHub = () => {
    setCampaignHubOpen(false);
    setSelectedCampaign(null);
  };

  const handleRestart = () => {
    setHashtagFilter(null);
    fetchPosts();
  };

  const handleReportPost = async (postId) => {
    try {
      await postService.reportPost(postId);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, isReported: true } : post
        )
      );
    } catch (error) {
      console.error("Failed to report post:", error);
    }
  };

  const handleCreatePost = async ({ content, media, mediaType }) => {
    try {
      let mediaUrl = null;
      if (media) {
        if (mediaType === 'video') {
          const uploadResponse = await postService.uploadVideo(media);
          mediaUrl = uploadResponse.data.videoUrl;
        } else {
          const uploadResponse = await postService.uploadImage(media);
          mediaUrl = uploadResponse.data.imageUrl;
        }
      }

      const postData = { content };
      if (mediaType === 'video') {
        postData.video_url = mediaUrl;
      } else if (mediaType === 'image') {
        postData.image_url = mediaUrl;
      }

      const response = await postService.createPost(postData);
      setPosts(prevPosts => [response.data, ...prevPosts]);
      setCreatePostModalOpen(false);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleOpenIntentModal = (userId) => {
    setSelectedUserId(userId);
    setIntentModalOpen(true);
  };

  const handleCloseIntentModal = () => {
    setIntentModalOpen(false);
    setSelectedUserId(null);
  };

  const handleFollow = async (intent) => {
    if (!selectedUserId) return;
    try {
      await followUser(currentUser.id, selectedUserId, intent);
      handleCloseIntentModal();
    } catch (error) { 
      console.error("Error following user:", error);
    }
  };
  
  const handleSetFeedType = (type) => {
    setFeedType(type);
    setHashtagFilter(null);
  }

  return (
      <HomePageContainer theme={theme}>
        <Grid container>
            <Grid item lg={3}>
                <FeedControlNav 
                    isOpen={true} // Always open on large screens
                    feedType={feedType}
                    setFeedType={handleSetFeedType}
                    handleRestart={handleRestart}
                    setCreatePostModalOpen={setCreatePostModalOpen}
                />
            </Grid>
            <Grid item xs={12} lg={6}>
                <MainContent theme={theme}>
                    {hashtagFilter && (
                        <HashtagHeader>
                            Filtering by: #{hashtagFilter}
                        </HashtagHeader>
                    )}
                    <ActivityFeed 
                      posts={posts} 
                      onReportPost={handleReportPost} 
                      onUsernameLongPress={handleOpenIntentModal} 
                      onHashtagClick={handleHashtagClick}
                      onCampaignClick={handleCampaignClick}
                    />
                </MainContent>
            </Grid>
            {isLargeScreen && (
                <Grid item lg={3}>
                    <RightSidebar>
                        {/* Placeholder for Trends, Who to Follow, etc. */}
                        <Typography variant="h6">Trends for you</Typography>
                        {/* Add content here */}
                    </RightSidebar>
                </Grid>
            )}
        </Grid>
        <CreatePostModal
          open={isCreatePostModalOpen}
          onClose={() => setCreatePostModalOpen(false)}
          onCreatePost={handleCreatePost}
        />
        <IntentModal open={intentModalOpen} onClose={handleCloseIntentModal} onFollow={handleFollow} />
        <CampaignHubModal 
          open={isCampaignHubOpen} 
          onClose={handleCloseCampaignHub} 
          campaignName={selectedCampaign} 
        />
      </HomePageContainer>
  );
};

export default HomePage;
