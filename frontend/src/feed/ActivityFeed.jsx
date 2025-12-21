
import React from 'react';
import styled from 'styled-components';
import Post from '../components/Post'; // Correctly import the Post component

const ActivityFeedContainer = styled.div`
  /* Add some spacing between posts */
  & > div {
    margin-bottom: 1rem;
    border-bottom: 1px solid #333;
    padding-bottom: 1rem;
  }
`;

const ActivityFeed = ({ posts, onReportPost }) => {
  if (!posts || posts.length === 0) {
    return <div>No posts to display.</div>;
  }

  return (
    <ActivityFeedContainer>
      {posts.map(post => (
        <Post 
          key={post.id} 
          post={post} 
          onReport={onReportPost} // Pass the reporting handler to the Post component
        />
      ))}
    </ActivityFeedContainer>
  );
};

export default ActivityFeed;
