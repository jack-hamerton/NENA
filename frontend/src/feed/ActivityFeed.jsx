import React from 'react';
import styled from 'styled-components';
import Post from './Post';

const ActivityFeedContainer = styled.div``;

const ActivityFeed = ({ posts }) => {
  return (
    <ActivityFeedContainer>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </ActivityFeedContainer>
  );
};

export default ActivityFeed;
