
import React from 'react';
import styled from 'styled-components';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const PostCard = styled(Card)`
  background-color: ${props => props.theme.palette.lightDark};
  color: ${props => props.theme.text.primary};
`;

const PostsGrid = ({ posts }) => {
  return (
    <GridContainer>
      {posts.map(post => (
        <PostCard key={post.id}>
          {post.media_url && (
            <CardMedia
              component="img"
              height="140"
              image={post.media_url}
              alt="Post media"
            />
          )}
          <CardContent>
            <Typography variant="body2">{post.content}</Typography>
          </CardContent>
        </PostCard>
      ))}
    </GridContainer>
  );
};

export default PostsGrid;
