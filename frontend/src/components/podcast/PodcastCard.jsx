
import React from 'react';
import styled from 'styled-components';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

const StyledCard = styled(Card)`
  max-width: 345px;
  margin: 1rem;
`;

const PodcastCard = ({ podcast }) => {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="140"
        image={podcast.imageUrl || 'https://via.placeholder.com/150'}
        alt={podcast.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {podcast.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {podcast.author}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default PodcastCard;
