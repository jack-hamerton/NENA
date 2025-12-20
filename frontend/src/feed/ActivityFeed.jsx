import React from 'react';
import styled from 'styled-components';
import { PostCard } from './PostCard';

const ActivityFeedContainer = styled.div``;

const ActivityFeed = ({ posts, onReportPost }) => {
  return (
    <ActivityFeedContainer>
      {posts.map(post => (
        <PostCard key={post.id} post={post} onReportPost={onReportPost} />
      ))}
    </ActivityFeedContainer>
  );
};

export default ActivityFeed;
