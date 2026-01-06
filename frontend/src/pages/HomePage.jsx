
import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import ActivityFeed from '../feed/ActivityFeed';
import * as postService from '../services/post.service';
import { followUser } from '../services/user.service';
import CreatePostModal from '../components/modals/CreatePostModal';
import IntentModal from '../components/profile/IntentModal';
import FloatingNav from '../layout/FloatingNav';
import { useAuth } from '../hooks/useAuth';

const FullScreenFeedContainer = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  background-color: ${props => props.theme.palette.background.default};
`;

const HomePage = () => {
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [feedType, setFeedType] = useState('for-you');
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [intentModalOpen, setIntentModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isNavOpen, setNavOpen] = useState(false);
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX; // Reset on new touch
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Swipe right from left edge to open
    if (touchStartX.current < 50 && isRightSwipe) {
      setNavOpen(true);
    }

    // Swipe left to close
    if (isNavOpen && isLeftSwipe) {
      setNavOpen(false);
    }
  };

  const fetchPosts = useCallback(async () => {
    try {
      const response = feedType === 'for-you'
        ? await postService.getForYouFeed()
        : await postService.getFollowingFeed();
      
      const postsWithReportStatus = response.data.map(post => ({ ...post, isReported: false }));
      setPosts(postsWithReportStatus);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setPosts([]);
    }
  }, [feedType]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleRestart = () => {
    fetchPosts();
    setNavOpen(false);
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

  const handleCreatePost = async (content) => {
    try {
      const response = await postService.createPost({ content });
      setPosts(prevPosts => [response.data, ...prevPosts]);
      setCreatePostModalOpen(false); // Close modal on success
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
    setNavOpen(false);
  }

  return (
      <FullScreenFeedContainer onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <FloatingNav 
          isOpen={isNavOpen}
          feedType={feedType}
          setFeedType={handleSetFeedType}
          handleRestart={handleRestart}
          setCreatePostModalOpen={setCreatePostModalOpen}
        />
        <CreatePostModal
          open={isCreatePostModalOpen}
          onClose={() => setCreatePostModalOpen(false)}
          onCreatePost={handleCreatePost}
        />
        <ActivityFeed posts={posts} onReportPost={handleReportPost} onUsernameLongPress={handleOpenIntentModal} />
        <IntentModal open={intentModalOpen} onClose={handleCloseIntentModal} onFollow={handleFollow} />
      </FullScreenFeedContainer>
  );
};

export default HomePage;
