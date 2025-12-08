import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ActivityFeed from './ActivityFeed';
import { getForYouFeed, getFollowingFeed } from '../services/postService';

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

const FeedPage = () => {
  const [feedType, setFeedType] = useState('for-you');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      let response;
      if (feedType === 'for-you') {
        response = await getForYouFeed();
      } else {
        response = await getFollowingFeed();
      }
      setPosts(response.data);
    };

    fetchPosts();
  }, [feedType]);

  return (
    <FeedContainer>
      <Tabs>
        <Tab active={feedType === 'for-you'} onClick={() => setFeedType('for-you')}>
          For You
        </Tab>
        <Tab active={feedType === 'following'} onClick={() => setFeedType('following')}>
          Following
        </Tab>
      </Tabs>
      <ActivityFeed posts={posts} />
    </FeedContainer>
  );
};

export default FeedPage;
