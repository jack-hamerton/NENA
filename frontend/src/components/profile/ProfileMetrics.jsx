
import React from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';

const ProfileMetrics = ({ followerIntentMetrics, hashtagMetrics, badges }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Grid container spacing={2} textAlign="center">
        <Grid item xs={4}>
          <Typography variant="h6">{followerIntentMetrics?.supporters || 0}</Typography>
          <Typography variant="body2">Supporters</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">{followerIntentMetrics?.amplifiers || 0}</Typography>
          <Typography variant="body2">Amplifiers</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">{followerIntentMetrics?.learners || 0}</Typography>
          <Typography variant="body2">Learners</Typography>
        </Grid>
      </Grid>
      {hashtagMetrics.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Topics Engaged:</Typography>
          <Typography variant="body2">{hashtagMetrics.map(metric => `${metric.tag} (${metric.count})`).join(', ')}</Typography>
        </Box>
      )}
      {badges.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Community Impact Badge:</Typography>
          <Typography variant="body2">{badges.map(badge => badge.name).join(', ')}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ProfileMetrics;
