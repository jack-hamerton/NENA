
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import ActivityFeed from '../feed/ActivityFeed';
import * as postService from '../services/post.service';

const FeedContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #333;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  color: ${props => (props.active ? '#fff' : '#888')};
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border-bottom: 2px solid ${props => (props.active ? '#1DA1F2' : 'transparent')};

  &:hover {
    background-color: #111;
  }
`;

const RestartButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #1DA1F2;
  border: none;
  border-radius: 9999px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-left: auto;
  align-self: center;
`;

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [feedType, setFeedType] = useState('for-you');

  const fetchPosts = useCallback(async () => {
    try {
      const response = feedType === 'for-you'
        ? await postService.getForYouFeed()
        : await postService.getFollowingFeed();
      
      // Ensure every post object has an `isReported` flag for the Post component
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

  // This function will be passed down to the Post component
  const handleReportPost = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, isReported: true } : post
      )
    );
    // In a real app, you'd also send this report to your backend API
    // e.g., postService.reportPost(postId);
    console.log(`Client-side report for post: ${postId}`);
  };

  return (
    <FeedContainer>
      <Tabs>
        <Tab active={feedType === 'for-you'} onClick={() => setFeedType('for-you')}>
          For You
        </Tab>
        <Tab active={feedType === 'following'} onClick={() => setFeedType('following')}>
          Following
        </Tab>
        <RestartButton onClick={handleRestart}>Restart</RestartButton>
      </Tabs>
      <ActivityFeed posts={posts} onReportPost={handleReportPost} />
    </FeedContainer>
  );
};

export default HomePage;
