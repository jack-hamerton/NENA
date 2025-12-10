import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import ActivityFeed from './ActivityFeed';
import { postService } from '../services/postService';

const FeedContainer = styled.div`
  /* Add your styles here */
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: ${props => (props.active ? '2px solid blue' : 'none')};
`;

const RestartButton = styled.button`
  margin-left: auto;
  padding: 5px 10px;
  cursor: pointer;
`;

const FeedPage = () => {
  const [feedType, setFeedType] = useState('for-you');
  const [posts, setPosts] = useState([]);

  const fetchPosts = useCallback(async () => {
    let response;
    if (feedType === 'for-you') {
      response = await postService.getForYouFeed();
    } else {
      response = await postService.getFollowingFeed();
    }
    setPosts(response.data);
  }, [feedType]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleRestart = () => {
    fetchPosts();
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
      <ActivityFeed posts={posts} />
    </FeedContainer>
  );
};

export default FeedPage;
