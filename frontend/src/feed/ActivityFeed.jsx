
import React from 'react';
import styled from 'styled-components';
// Correcting the import to the actual Post component we modified
import { Post } from '../components/post/Post';

const ActivityFeedContainer = styled.div`
  /* Add some spacing between posts */
  padding: 0 1rem; // Add some horizontal padding for better spacing on mobile
  & > div {
    margin-bottom: 1rem;
  }
`;

const EmptyState = styled.div`
  padding: 1rem;
  text-align: center;
  margin-top: 2rem;
  color: ${props => props.theme.text?.primary || '#ffffff'};
`;

const ActivityFeed = ({ posts, onReportPost, onUsernameLongPress, onHashtagClick, onCampaignClick }) => {
  if (!posts || posts.length === 0) {
    return <EmptyState>No posts to display.</EmptyState>;
  }

  return (
    <ActivityFeedContainer>
      {posts.map(post => (
        <Post // Using the Post component that we updated
          key={post.id} 
          post={post} 
          onReportPost={onReportPost}
          onUsernameLongPress={onUsernameLongPress}
          onHashtagClick={onHashtagClick}
          onCampaignClick={onCampaignClick} // Pass the prop down
        />
      ))}
    </ActivityFeedContainer>
  );
};

export default ActivityFeed;
