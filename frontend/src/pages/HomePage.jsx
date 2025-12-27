
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import ActivityFeed from '../feed/ActivityFeed';
import * as postService from '../services/post.service';
import { followUser } from '../services/user.service';
import CreatePostModal from '../components/modals/CreatePostModal';
import IntentModal from '../components/profile/IntentModal';
import { useAuth } from '../hooks/useAuth';

const FeedContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.palette.dark};
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  color: ${props => (props.active ? props.theme.text.primary : props.theme.text.secondary)};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border-bottom: 2px solid ${props => (props.active ? props.theme.palette.accent : 'transparent')};

  &:hover {
    background-color: ${props => props.theme.palette.dark};
  }
`;

const RestartButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.palette.secondary};
  border: none;
  border-radius: 9999px;
  color: ${props => props.theme.text.primary};
  font-weight: bold;
  cursor: pointer;
  margin-left: auto;
  align-self: center;
`;

const CreatePostButton = styled.button`
    background-color: ${props => props.theme.palette.secondary};
    color: ${props => props.theme.text.primary};
    border: none;
    padding: 1rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
    margin-bottom: 1rem;
`;

const HomePage = () => {
  const { user: currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [feedType, setFeedType] = useState('for-you');
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState(false);
  const [intentModalOpen, setIntentModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

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


  return (
      <FeedContainer>
        <CreatePostButton onClick={() => setCreatePostModalOpen(true)}>Create Post</CreatePostButton>
        <CreatePostModal
          open={isCreatePostModalOpen}
          onClose={() => setCreatePostModalOpen(false)}
          onCreatePost={handleCreatePost}
        />
        <Tabs>
          <Tab active={feedType === 'for-you'} onClick={() => setFeedType('for-you')}>
            For You
          </Tab>
          <Tab active={feedType === 'following'} onClick={() => setFeedType('following')}>
            Following
          </Tab>
          <RestartButton onClick={handleRestart}>Restart</RestartButton>
        </Tabs>
        <ActivityFeed posts={posts} onReportPost={handleReportPost} onUsernameLongPress={handleOpenIntentModal} />
        <IntentModal open={intentModalOpen} onClose={handleCloseIntentModal} onFollow={handleFollow} />
      </FeedContainer>
  );
};

export default HomePage;
