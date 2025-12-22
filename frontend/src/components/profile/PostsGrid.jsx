
import React, { useState } from 'react';
import styled from 'styled-components';

const PostsContainer = styled.div`
  margin-bottom: 2rem;
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`;

const PostCard = styled.div`
  background-color: #222;
  border-radius: 8px;
  padding: 1rem;
  color: #fff;
`;

const ShowMoreButton = styled.button`
  background-color: #333;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
`;

const PostsGrid = ({ posts }) => {
  const [showAll, setShowAll] = useState(false);
  const visiblePosts = showAll ? posts : posts.slice(0, 8);

  return (
    <PostsContainer>
      <h2>Posts</h2>
      <PostGrid>
        {visiblePosts.map(post => (
          <PostCard key={post.id}>{post.content}</PostCard>
        ))}
      </PostGrid>
      {posts.length > 8 && (
        <ShowMoreButton onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : 'Show More'}
        </ShowMoreButton>
      )}
    </PostsContainer>
  );
};

export default PostsGrid;
