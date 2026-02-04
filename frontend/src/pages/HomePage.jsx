
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useMediaQuery, useTheme } from '@mui/material';
import ActivityFeed from '../feed/ActivityFeed';
import * as postService from '../services/post.service';
import { followUser } from '../services/user.service';
import CreatePostModal from '../components/modals/CreatePostModal';
import IntentModal from '../components/profile/IntentModal';
import FeedControlNav from '../layout/FeedControlNav';
import { useAuth } from '../hooks/useAuth';

const HomePageContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.palette.background.default};
  overflow: hidden; /* Hide scrollbars from the container */
`;

const MainContent = styled.div`
  flex-grow: 1;
  position: relative;
  height: 100vh;
  overflow-y: auto; /* Allow scrolling on the feed only */
`;

const HashtagHeader = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0,0,0,0.7);
    padding: 1rem;
    z-index: 100;
    text-align: center;
    color: #fff;
`;

const NavToggle = styled.button`
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1001;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.theme.palette.secondary.main};
  color: ${props => props.theme.palette.secondary.contrastText};
  cursor: pointer;
`;

const HomePage = () => {
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [feedType, setFeedType] = useState('for-you');
  const [hashtagFilter, setHashtagFilter] = useState(null);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [intentModalOpen, setIntentModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isNavOpen, setNavOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isMobile) return;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (touchStartX.current < 50 && isRightSwipe) {
      setNavOpen(true);
    }

    if (isNavOpen && isLeftSwipe) {
      setNavOpen(false);
    }
  };

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
      
      const postsWithReportStatus = response.data.map(post => ({ ...post, isReported: false }));
      setPosts(postsWithReportStatus);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts([]);
    }
  }, [feedType, hashtagFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    // Control nav visibility based on screen size
    setNavOpen(!isMobile);
  }, [isMobile]);
  
  const handleHashtagClick = (hashtag) => {
      setHashtagFilter(hashtag.substring(1));
      if(isMobile) setNavOpen(false);
  }

  const handleRestart = () => {
    setHashtagFilter(null);
    fetchPosts();
    if(isMobile) setNavOpen(false);
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

  const handleCreatePost = async ({ content, media }) => {
    try {
      let imageUrl = null;
      if (media) {
        const uploadResponse = await postService.uploadImage(media);
        imageUrl = uploadResponse.data.imageUrl;
      }
      const response = await postService.createPost({ content, image_url: imageUrl });
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
    if(isMobile) setNavOpen(false);
  }

  return (
      <HomePageContainer theme={theme} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {isMobile && (
          <NavToggle onClick={() => setNavOpen(open => !open)} theme={theme}>
            {isNavOpen ? 'Close' : 'Menu'}
          </NavToggle>
        )}
        <FeedControlNav 
          isOpen={isNavOpen}
          feedType={feedType}
          setFeedType={handleSetFeedType}
          handleRestart={handleRestart}
          setCreatePostModalOpen={setCreatePostModalOpen}
        />
        <MainContent>
            {hashtagFilter && (
                <HashtagHeader>
                    Filtering by: #{hashtagFilter}
                </HashtagHeader>
            )}
            <ActivityFeed posts={posts} onReportPost={handleReportPost} onUsernameLongPress={handleOpenIntentModal} onHashtagClick={handleHashtagClick} />
        </MainContent>
        <CreatePostModal
          open={isCreatePostModalOpen}
          onClose={() => setCreatePostModalOpen(false)}
          onCreatePost={handleCreatePost}
        />
        <IntentModal open={intentModalOpen} onClose={handleCloseIntentModal} onFollow={handleFollow} />
      </HomePageContainer>
  );
};

export default HomePage;
