
import React from 'react';
import styled from 'styled-components';
import PostCard from './PostCard';

const ActivityFeedContainer = styled.div`
  /* Add some spacing between posts */
  & > div {
    margin-bottom: 1rem;
  }
`;

const ActivityFeed = ({ posts, onReportPost }) => {
  if (!posts || posts.length === 0) {
    return <div>No posts to display.</div>;
  }

  return (
    <ActivityFeedContainer>
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          onReportPost={onReportPost}
        />
      ))}
    </ActivityFeedContainer>
  );
};

export default ActivityFeed;
