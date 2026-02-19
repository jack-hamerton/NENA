import React from 'react';
import { Grid } from '@mui/material';
import UserSearchResult from './UserSearchResult';
import PostSearchResult from './PostSearchResult';
import HashtagSearchResult from './HashtagSearchResult';
import { DiscoverResult } from '../types/discover';

interface ResultsGridProps {
  results: DiscoverResult[];
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results }) => {
  return (
    <Grid container spacing={2}>
      {results.map((result) => (
        <Grid item xs={12} sm={6} md={4} key={result.id}>
          {result.type === 'user' && <UserSearchResult user={result} />}
          {result.type === 'post' && <PostSearchResult post={result} />}
          {result.type === 'hashtag' && <HashtagSearchResult hashtag={result} />}
        </Grid>
      ))}
    </Grid>
  );
};

export default ResultsGrid;
