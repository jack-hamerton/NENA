import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { DiscoverResult } from '../types/discover';

interface ResultsGridProps {
  results: DiscoverResult[];
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ results }) => {
  return (
    <Grid container spacing={2}>
      {results.map((result) => (
        <Grid item xs={12} sm={6} md={4} key={result.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{result.title}</Typography>
              <Typography variant="body2">{result.summary}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ResultsGrid;
